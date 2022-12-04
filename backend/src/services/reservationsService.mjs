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
    parseISO,
    roundToNearestMinutes,
} from "date-fns";
import schedule from "node-schedule";
import { CoveredError, getDaysInMonth, getUTCDate, getUTCFromDateAndLocalTimeString } from "../utils/index.mjs";
import { ReservationsRepository } from "../repositories/index.mjs";

class ReservationsService {
    constructor(ReservationsRepository) {
        this.ReservationsRepository = ReservationsRepository;
        this.TemporalReservations = {};
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

        const reservations = await this.getReservationsBetweenDates(startBusinessDate, endBusinessDate);
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
            return [{ start: startOfBusiness, end: endOfBusiness }];
        }

        this.sortReservationList(reservationsList);
        const incrementToRound = parseInt(process.env.BOOKING_EVERY_NEAREST_MINUES || "15") / 2;
        const result = [];

        for (let i = 0; i <= reservationsList.length; i++) {
            const start =
                i === 0
                    ? startOfBusiness
                    : roundToNearestMinutes(
                          add(reservationsList[i - 1].date, {
                              minutes:
                                  (await reservationsList[i - 1].getService()).minutesRequired +
                                  parseInt(process.env.BREAK_BETWEEN_BOOKINGS || "10") +
                                  incrementToRound,
                          }),
                          {
                              nearestTo: parseInt(process.env.BOOKING_EVERY_NEAREST_MINUES || "15"),
                          }
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
                        newIntervalsToTest.length,
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
        }
        return result;
    }

    async getIsDateAvailable(isoTimeString, service) {
        const date = parseISO(isoTimeString);
        const collidingBookings = await this.getReservationsBetweenDates(
            date,
            add(date, { minutes: service.minutesRequired })
        );
        return collidingBookings.length === 0;
    }

    async getReservationsBetweenDates(startDate, endDate) {
        const active = await this.ReservationsRepository.getReservationsBetween(startDate, endDate);
        const temporal = Object.values(this.TemporalReservations).filter((temporal) => {
            return (
                (isAfter(temporal.date, startDate) || isEqual(temporal.date, endDate)) &&
                (isEqual(temporal.date, endDate) || isBefore(temporal.date, endDate))
            );
        });
        return [...active, ...temporal];
    }

    createNewTemporalBooking(isoTimeString, service) {
        const currentDate = new Date();
        const bookDate = parseISO(isoTimeString);
        const id = `TEMP${currentDate.valueOf()}%%%%${bookDate.toISOString()}`;
        const temporalBooking = {
            id,
            date: bookDate,
            service: service,
            getService() {
                return this.service;
            },
        };

        this.TemporalReservations[id] = temporalBooking;

        schedule.scheduleJob(
            add(currentDate, { minutes: parseInt(process.env.BOOKING_TEMPORAL_RESERVATION_VALIDITY || "15") }),
            (() => delete this.TemporalReservations[id]).bind(this)
        );
        return temporalBooking;
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
