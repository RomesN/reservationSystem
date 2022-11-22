import "dotenv/config";
import {
    add,
    areIntervalsOverlapping,
    differenceInMinutes,
    endOfDay,
    intervalToDuration,
    isBefore,
    isSameSecond,
    roundToNearestMinutes,
    isAfter,
} from "date-fns";
import { CoveredError, getDaysInMonth, getUTCDate, getUTCFromDateAndLocalTimeString } from "../utils/index.mjs";
import { ReservationsRepository } from "../repositories/index.mjs";

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

        const result = [];
        let reservationIndex = 0;
        let testingSuitableInterval = {
            start: startOfBusiness,
            end: add(startOfBusiness, { minutes: minutesNeeded + parseInt(process.env.BREAK_BETWEEN_BOOKINGS) }),
        };

        let comparingInterval;

        while (
            !isSameSecond(testingSuitableInterval.end, endOfBusiness) &&
            !isBefore(endOfBusiness, testingSuitableInterval.end)
        ) {
            if (reservationIndex < reservationsList.length) {
                comparingInterval = {
                    start: reservationsList[reservationIndex].date,
                    end: add(reservationsList[reservationIndex].date, {
                        minutes:
                            (await reservationsList[reservationIndex].getService()).minutesRequired +
                            parseInt(process.env.BREAK_BETWEEN_BOOKINGS),
                    }),
                };

                if (!areIntervalsOverlapping(testingSuitableInterval, comparingInterval)) {
                    result.push(testingSuitableInterval);
                    testingSuitableInterval.start = roundToNearestMinutes(testingSuitableInterval.end, {
                        nearestTo: 15,
                        roundingMethod: "ceil",
                    });
                    testingSuitableInterval.end = add(testingSuitableInterval.start, {
                        minutes: minutesNeeded + parseInt(process.env.BREAK_BETWEEN_BOOKINGS),
                    });
                } else {
                    testingSuitableInterval.start = roundToNearestMinutes(comparingInterval.end, {
                        nearestTo: 15,
                        roundingMethod: "ceil",
                    });
                    testingSuitableInterval.end = add(testingSuitableInterval.start, {
                        minutes: minutesNeeded + parseInt(process.env.BREAK_BETWEEN_BOOKINGS),
                    });
                    reservationIndex++;
                }
            } else {
                testingSuitableInterval.start = roundToNearestMinutes(
                    add(reservationsList[reservationIndex - 1].date, {
                        minutes:
                            (await reservationsList[reservationIndex - 1].getService()).minutesRequired +
                            parseInt(process.env.BREAK_BETWEEN_BOOKINGS),
                    }),
                    {
                        nearestTo: 15,
                        roundingMethod: "ceil",
                    }
                );
                testingSuitableInterval.end = endOfBusiness;

                if (
                    Math.max(
                        intervalToDuration(testingSuitableInterval).minutes,
                        intervalToDuration(testingSuitableInterval).hours * 60
                    ) > minutesNeeded
                ) {
                    result.push(testingSuitableInterval);
                }
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
                                Math.max(intervalToDuration(inter).minutes, intervalToDuration(inter).hours * 60) >
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

    async getReservationsBetweenDates(startDate, endDate) {
        return await this.ReservationsRepository.getReservationsBetween(startDate, endDate);
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
