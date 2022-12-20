import "dotenv/config";
import {
    add,
    areIntervalsOverlapping,
    differenceInMinutes,
    endOfDay,
    intervalToDuration,
    isAfter,
    isBefore,
    isEqual,
    isSameSecond,
    parseISO,
} from "date-fns";
import schedule from "node-schedule";
import {
    CoveredError,
    generateCustomToken,
    getDaysInMonth,
    getUTCDate,
    getUTCFromDateAndLocalTimeString,
    roundToNearestMinutesUp,
} from "../utils/index.mjs";
import { ReservationsRepository } from "../repositories/index.mjs";
import enums from "../model/enums/index.mjs";

class ReservationsService {
    constructor(ReservationsRepository) {
        this.ReservationsRepository = ReservationsRepository;
    }

    async getMonthServiceInfoObject(serviceRequired, year, month, restrictionService) {
        if (!serviceRequired || !year || !month) {
            throw new CoveredError(400, "One or more missing arguments.");
        }

        const yearAsNumber = parseInt(year);
        const monthAsNumber = parseInt(month);

        if (!Number.isInteger(yearAsNumber) || !Number.isInteger(monthAsNumber) || monthAsNumber > 12) {
            throw new CoveredError(400, "Input in wrong format.");
        }

        if (yearAsNumber < new Date().getFullYear() && monthAsNumber < new Date().getMonth() + 1) {
            throw new CoveredError(400, "The month/year combination in the past.");
        }

        const numberOfDays = getDaysInMonth(year, monthAsNumber);

        const infoObject = {
            year: yearAsNumber,
            month: monthAsNumber,
            numberOfDays,
            timesOffsetedByMinutes: new Date().getTimezoneOffset(),
            serviceRequiredId: serviceRequired.id,
            serviceRequiredName: serviceRequired.name,
            serviceRequiredTime: serviceRequired.minutesRequired,
        };

        for (let i = 1; i <= numberOfDays; i++) {
            const dateRequired = getUTCDate(yearAsNumber, monthAsNumber, i);
            infoObject[i] = await this.getFreeIntervalsOnGivenDay(
                dateRequired,
                infoObject.serviceRequiredTime,
                restrictionService
            );
        }

        return infoObject;
    }

    async getMonthReservationOverviewObject(year, month) {
        if (!year || !month) {
            throw new CoveredError(400, "One or more missing arguments.");
        }

        const yearAsNumber = parseInt(year);
        const monthAsNumber = parseInt(month);

        if (!Number.isInteger(yearAsNumber) || !Number.isInteger(monthAsNumber) || monthAsNumber > 12) {
            throw new CoveredError(400, "Input in wrong format.");
        }

        if (yearAsNumber < new Date().getFullYear() && monthAsNumber < new Date().getMonth() + 1) {
            throw new CoveredError(400, "The month/year combination in the past.");
        }

        const numberOfDays = getDaysInMonth(year, monthAsNumber);

        const infoObject = {
            year: yearAsNumber,
            month: monthAsNumber,
            numberOfDays,
            timesOffsetedByMinutes: new Date().getTimezoneOffset(),
        };

        for (let i = 1; i <= numberOfDays; i++) {
            infoObject[i] = await this.ReservationsRepository.getActiveReservationsBetween(
                new Date(yearAsNumber, monthAsNumber - 1, i, 0, 0, 0),
                new Date(yearAsNumber, monthAsNumber - 1, i, 23, 59, 59)
            );
        }

        return infoObject;
    }

    async getFreeIntervalsOnGivenDay(date, minutesNeeded, restrictionService) {
        // is before today
        if (isBefore(date, endOfDay(new Date()))) {
            return [];
        }

        const businessHours = await restrictionService.getBusinessHours(date);
        const wholeDayClosed = await restrictionService.getWholeDayRestriction(date);

        // is generally closed on given day
        if (!businessHours.startTime || !businessHours.endTime || wholeDayClosed) {
            return [];
        }

        const startBusinessDate = getUTCFromDateAndLocalTimeString(date, businessHours.startTime);
        const endBusinessDate = getUTCFromDateAndLocalTimeString(date, businessHours.endTime);

        // is opened less than required time
        if (differenceInMinutes(endBusinessDate, startBusinessDate) < minutesNeeded) {
            return [];
        }

        const reservations = await this.getValidReservationsBetweenDates(startBusinessDate, endBusinessDate);
        const otherGeneralResctrictions = await restrictionService.getGeneralPartialDayRestrictions(date);
        const otherOneOffRestrictions = await restrictionService.getOneoffPartialDayRestrictions(date);
        const businessClosedIntervals = await restrictionService.getBusinessClosedIntervals(
            date,
            otherGeneralResctrictions,
            otherOneOffRestrictions
        );
        const suitableNotBooked = await this.calculateNotBookedIntervals(
            minutesNeeded,
            reservations,
            startBusinessDate,
            endBusinessDate
        );

        return this.getSuitableIntervalsPassingRestrictions(suitableNotBooked, businessClosedIntervals, minutesNeeded);
    }

    async calculateNotBookedIntervals(minutesNeeded, reservationsList, startOfBusiness, endOfBusiness) {
        if (reservationsList.length === 0) {
            return [
                {
                    start: roundToNearestMinutesUp(startOfBusiness),
                    end: endOfBusiness,
                },
            ];
        }

        this.sortReservationList(reservationsList);
        const result = [];

        for (let i = 0; i <= reservationsList.length; i++) {
            const start =
                i === 0
                    ? startOfBusiness
                    : roundToNearestMinutesUp(
                          add(reservationsList[i - 1].date, {
                              minutes:
                                  (await reservationsList[i - 1].getService()).minutesRequired +
                                  parseInt(process.env.BREAK_BETWEEN_BOOKINGS || "10"),
                          })
                      );
            const end = i === reservationsList.length ? endOfBusiness : reservationsList[i].date;
            const testingSuitableInterval = { start, end };

            if (
                intervalToDuration(testingSuitableInterval).minutes +
                    intervalToDuration(testingSuitableInterval).hours * 60 >=
                minutesNeeded + parseInt(process.env.BREAK_BETWEEN_BOOKINGS || "10")
            ) {
                result.push(testingSuitableInterval);
            }
        }

        return result;
    }

    getSuitableIntervalsPassingRestrictions(notBookedIntervals, bussinessClosedIntervals, minutesNeeded) {
        const result = [];
        let i = 0;
        let j = 0;
        while (i < notBookedIntervals.length) {
            while (j < bussinessClosedIntervals.length) {
                if (areIntervalsOverlapping(notBookedIntervals[i], bussinessClosedIntervals[j])) {
                    const newIntervalsToTest = [];

                    if (isBefore(notBookedIntervals[i].start, bussinessClosedIntervals[j].start)) {
                        newIntervalsToTest.push({
                            start: notBookedIntervals[i].start,
                            end: bussinessClosedIntervals[j].start,
                        });
                        if (isBefore(bussinessClosedIntervals[j].end, notBookedIntervals[i].end)) {
                            newIntervalsToTest.push({
                                start: bussinessClosedIntervals[j].end,
                                end: notBookedIntervals[i].end,
                            });
                        }
                    } else if (isAfter(notBookedIntervals[i].end, bussinessClosedIntervals[j].end)) {
                        newIntervalsToTest.push({
                            start: bussinessClosedIntervals[j].end,
                            end: notBookedIntervals[i].end,
                        });
                    }

                    notBookedIntervals.splice(
                        i,
                        1,
                        ...newIntervalsToTest.filter(
                            (inter) =>
                                intervalToDuration(inter).minutes + intervalToDuration(inter).hours * 60 >=
                                minutesNeeded
                        )
                    );
                } else {
                    j++;
                }
            }
            result.push(notBookedIntervals[i]);
            i++;
            j = 0;
        }

        // if env variables set constrain that closest reservation can be X minutes from now - test it
        const closestMinutesRestriction = parseInt(process.env.CLOSEST_RESERVATION_MINUTES_FROM_NOW);

        let k = 0;
        if (!Number.isNaN(closestMinutesRestriction)) {
            const soonestPossible = roundToNearestMinutesUp(add(new Date(), { minutes: closestMinutesRestriction }));
            while (k < result.length) {
                if (isBefore(result[k].start, soonestPossible) && isBefore(result[k].end, soonestPossible)) {
                    result.splice(k, 1);
                } else if (isBefore(result[k].start, soonestPossible) && isAfter(result[k].end, soonestPossible)) {
                    const testingInterval = { start: soonestPossible, end: result[k].end };
                    if (
                        isAfter(result[k].end, soonestPossible) &&
                        intervalToDuration(testingInterval).minutes + intervalToDuration(testingInterval).hours * 60 >=
                            minutesNeeded + parseInt(process.env.BREAK_BETWEEN_BOOKINGS || "10")
                    ) {
                        result.splice(k, 1, testingInterval);
                    } else {
                        result.splice(k, 1);
                    }
                } else {
                    k++;
                }
            }
        }

        return result;
    }

    async getIsDateAvailable(isoTimeString, minutesNeeded, restrictionService) {
        if (!isoTimeString || !minutesNeeded || !restrictionService) {
            throw new CoveredError(400, "One or more parameters is missing.");
        }

        const date = parseISO(isoTimeString);
        const intervalRequired = { start: date, end: add(date, { minutes: minutesNeeded }) };

        if (isBefore(intervalRequired.start, endOfDay(new Date()))) {
            throw new CoveredError(400, "The closest reservation can be for tomorrow.");
        }

        const freeBookings = await this.getFreeIntervalsOnGivenDay(date, minutesNeeded, restrictionService);
        return freeBookings.some((interval) => {
            if (areIntervalsOverlapping(interval, intervalRequired)) {
                return (
                    (isBefore(interval.start, intervalRequired.start) ||
                        isEqual(interval.start, intervalRequired.start)) &&
                    (isAfter(interval.end, intervalRequired.end) || isEqual(interval.end, intervalRequired.end))
                );
            } else {
                return false;
            }
        });
    }

    async getValidReservationsBetweenDates(startDate, endDate) {
        return await this.ReservationsRepository.getValidReservationsBetween(startDate, endDate);
    }

    async getActiveReservationsBetween(startDate, endDate) {
        return await this.ReservationsRepository.getActiveReservationsBetween(startDate, endDate);
    }

    async createNewTemporaryReservation(isoTimeString, serviceIdString, ServicesService, RestrictionsService) {
        // #region ---VARIABLES CALCULATION---
        const service = await ServicesService.getServiceRequired(serviceIdString);
        const currentDate = new Date();
        const validityEnd = add(currentDate, {
            minutes: parseInt(process.env.BOOKING_TEMPORARY_RESERVATION_VALIDITY || "15"),
        });
        const reservationStart = parseISO(isoTimeString);
        // #endregion ---VARIABLES CALCULATION---

        // #region ---CONSTRAINS CHECKING---
        if (isBefore(reservationStart, endOfDay(new Date()))) {
            throw new CoveredError(400, "The closest reservation can be for tomorrow.");
        }

        if (!isoTimeString || !serviceIdString) {
            throw new CoveredError(400, "One or more parameters is missing.");
        }

        if (!service) {
            throw new CoveredError(400, "Service id does not exist.");
        }

        if (reservationStart.getMinutes() % parseInt(process.env.BOOKING_EVERY_NEAREST_MINUES || "15") !== 0) {
            throw new CoveredError(
                400,
                "Reservation start must be nearest " + process.env.BOOKING_EVERY_NEAREST_MINUES + " minutes."
            );
        }
        // #endregion ---CONSTRAINS CHECKING---

        // #region ---TEMPLATE RESERVATION CREATION---
        let reservationToken;
        const tokenLength = Number.isNaN(parseInt(process.env.RESERVATION_TOKEN_LENGTH))
            ? 10
            : parseInt(process.env.RESERVATION_TOKEN_LENGTH);
        do {
            reservationToken = generateCustomToken(tokenLength);
        } while (await this.ReservationsRepository.getReservationByToken(reservationToken));

        const temporaryReservation = {
            date: reservationStart,
            detail: null,
            serviceId: service.id,
            reservationStatus: enums.status.TEMPORARY,
            reservationToken,
            validityEnd,
        };

        // #endregion ---TEMPLATE RESERVATION CREATION---

        // #region ---CHECK IF STILL FREE---
        if (!(await this.getIsDateAvailable(isoTimeString, service.minutesRequired, RestrictionsService))) {
            throw new CoveredError(409, "There is already reservation for required time interval.");
        }
        // #endregion ---CHECK IF STILL FREE---

        // creation and scheduling removal in case not confirmed
        temporaryReservation.scheduledDeletionJobId = schedule.scheduleJob(validityEnd, () => {
            this.deleteReservationIfInvalid(temporaryReservation.reservationToken);
        }).name;

        return await this.ReservationsRepository.createReservation(temporaryReservation);
    }

    async deleteTemporaryReservation(reservationToken) {
        if (!reservationToken) {
            throw new CoveredError(400, "Token not provided.");
        }

        const reservationToDelete = await this.ReservationsRepository.getTemporaryReservationByToken(reservationToken);

        if (!reservationToDelete) {
            throw new CoveredError(400, "No temporary reservation exists with provided token.");
        }

        await this.ReservationsRepository.deleteReservationByToken(reservationToken);
    }

    async deleteFinalReservation(reservationToken) {
        if (!reservationToken) {
            throw new CoveredError(400, "Token not provided.");
        }

        const reservationToDelete = await this.ReservationsRepository.getActiveReservationByToken(reservationToken);

        if (!reservationToDelete) {
            throw new CoveredError(400, "No final reservation exists with provided token.");
        }

        if (isBefore(add(reservationToDelete.date, { minutes: -1 * 60 * 24 }), new Date())) {
            throw new CoveredError(403, "Reservation cannot be canceled less than 24 hours before.");
        }

        if (reservationToDelete.scheduledReminderJobId) {
            schedule.cancelJob(reservationToDelete.scheduledReminderJobId);
        }
        return await this.ReservationsRepository.deleteReservationByToken(reservationToken);
    }

    async deleteFinalReservationByAdmin(reservationToken) {
        if (!reservationToken) {
            throw new CoveredError(400, "Token not provided.");
        }

        const reservationToDelete = await this.ReservationsRepository.getActiveReservationByToken(reservationToken);

        if (!reservationToDelete) {
            throw new CoveredError(400, "No final reservation exists with provided token.");
        }

        if (reservationToDelete.scheduledReminderJobId) {
            schedule.cancelJob(reservationToDelete.scheduledReminderJobId);
        }
        return await this.ReservationsRepository.deleteReservationByToken(reservationToken);
    }

    async deleteReservationIfInvalid(reservationToken) {
        const reservationToDelete = await this.ReservationsRepository.getReservationByToken(reservationToken);
        const now = new Date();

        if (
            reservationToDelete &&
            (isAfter(now, reservationToDelete.validityEnd) || isSameSecond(reservationToDelete.validityEnd, now))
        ) {
            this.ReservationsRepository.deleteReservationByToken(reservationToken);
        }
    }

    async getTemporaryReservationByToken(reservationToken) {
        const reservation = await this.ReservationsRepository.getTemporaryReservationByToken(reservationToken);
        if (!reservation) {
            throw new CoveredError("No temporary reservation token provided.");
        }

        if (isBefore(reservation.validityEnd, new Date())) {
            throw new CoveredError("No temporary reservation for provided token.");
        }
        return reservation;
    }

    async makeReservationFinal(reservation, customer, note) {
        const scheduleCancel = schedule.cancelJob(reservation.scheduledDeletionJobId);

        if (note && note.length > 60) {
            throw new CoveredError("Note cannot exceed 60 characters.");
        }

        const update = {
            validityEnd: reservation.date,
            reservationStatus: enums.status.ACTIVE,
            customerId: customer.id,
            scheduledDeletionJobId: null,
            note: note || null,
        };

        const affectedRows = await this.ReservationsRepository.updateReservation(reservation.id, update);

        if (affectedRows[0] !== 1 || !reservation.scheduledDeletionJobId || !scheduleCancel) {
            throw new Error(
                "The operation of making reservation to be final failed. Please make sure that temporary reservation was made first."
            );
        }

        return affectedRows[0];
    }

    async updateReservation(id, update) {
        return await this.ReservationsRepository.updateReservation(id, update);
    }

    async getActiveReservationByToken(token) {
        return await this.ReservationsRepository.getActiveReservationByToken(token);
    }

    sortReservationList(reservationsList) {
        return reservationsList.sort((resA, resB) => {
            if (resA.date < resB.date) {
                return -1;
            } else {
                return 1;
            }
        });
    }
}

export default new ReservationsService(ReservationsRepository);
