import "dotenv/config";
import {
    add,
    areIntervalsOverlapping,
    differenceInMinutes,
    endOfDay,
    intervalToDuration,
    isAfter,
    isBefore,
    isSameSecond,
    parse,
    roundToNearestMinutes,
} from "date-fns";
import {
    CoveredError,
    daysOfTheWeekNum,
    monthsOfTheYearNumString,
    getDaysInMonth,
    getWeekdayNumberMonIsOne,
    getUTCFromDateAndLocalTimeString,
} from "../utils/index.mjs";
import { RestrictionsRepository, ReservationsRepository, ServicesRepository } from "../repositories/index.mjs";

class ServicesService {
    constructor(ServicesRepository) {
        this.ServicesRepository = ServicesRepository;
    }

    async getServicesList() {
        const services = await ServicesRepository.getServicesList();
        if (!services) {
            throw new CoveredError(204, "No services available");
        }
        return services;
    }

    async getFreeIntervals(serviceId, year, month) {
        if (!serviceId || !year || !month) {
            throw new CoveredError(400, "One or more missing arguments.");
        }

        const serviceIdAsNumber = parseInt(serviceId);
        const yearAsNumber = parseInt(year);
        const monthAsNumber = parseInt(month);

        if (
            !Number.isInteger(serviceIdAsNumber) ||
            !Number.isInteger(yearAsNumber) ||
            !Number.isInteger(monthAsNumber) ||
            monthAsNumber > 12
        ) {
            throw new CoveredError(400, "Input in wrong format.");
        }

        if (yearAsNumber < new Date().getFullYear() || monthAsNumber < new Date().getMonth() + 1) {
            throw new CoveredError(400, "The month/year combination in the past.");
        }

        const serviceRequired = await this.getServiceRequired(serviceIdAsNumber);
        const numberOfDays = getDaysInMonth(year, monthAsNumber);

        const availableDays = {
            year,
            month: monthsOfTheYearNumString[monthAsNumber],
            numberOfDays,
            timesOffsetedByMinutes: new Date().getTimezoneOffset(),
            serviceRequiredId: serviceRequired.id,
            serviceRequiredName: serviceRequired.name,
            serviceRequiredTime: serviceRequired.minutesRequired,
        };

        for (let i = 1; i <= numberOfDays; i++) {
            const dateRequired = new Date(Date.UTC(year, month - 1, i));
            availableDays[i] = await this.getFreeIntervalsPerDay(dateRequired, availableDays.serviceRequiredTime);
        }

        return availableDays;
    }

    async getFreeIntervalsPerDay(date, minutesNeeded) {
        // is before today
        if (isBefore(date, endOfDay(new Date()))) {
            return false;
        }

        const businessHours = await RestrictionsRepository.getBusinessHours(
            daysOfTheWeekNum[getWeekdayNumberMonIsOne(date)]
        );
        const wholeDayClosed = await RestrictionsRepository.getWholeDayRestriction(date);

        // is generally closed on given day
        if (!businessHours.startTime || !businessHours.endTime || wholeDayClosed) {
            return false;
        }

        const startBusinessDate = getUTCFromDateAndLocalTimeString(date, businessHours.startTime);
        const endBusinessDate = getUTCFromDateAndLocalTimeString(date, businessHours.endTime);

        // is opened less than required time
        if (differenceInMinutes(endBusinessDate, startBusinessDate) < minutesNeeded) {
            return false;
        }

        const reservations = await ReservationsRepository.getReservationsBetween(startBusinessDate, endBusinessDate);
        const otherGeneralResctrictions = await RestrictionsRepository.getGeneralPartialDayRestrictions(
            daysOfTheWeekNum[getWeekdayNumberMonIsOne(startBusinessDate)]
        );
        const otherOneOffRestrictions = await RestrictionsRepository.getOneoffPartialDayRestrictions(startBusinessDate);
        const businessClosedIntervals = this.getBusinessClosedIntervals(
            date,
            otherGeneralResctrictions,
            otherOneOffRestrictions
        );

        const suitableNotBooked = await this.getSuitableNotBookedIntervals(
            minutesNeeded,
            reservations,
            startBusinessDate,
            endBusinessDate
        );

        return this.getSuitableIntervalsPassingRestrictions(suitableNotBooked, businessClosedIntervals, minutesNeeded);
    }

    getBusinessClosedIntervals(date, generalPartialResctrictions, oneoffPartialRestrictions) {
        const result = [];
        if (generalPartialResctrictions.length !== 0) {
            generalPartialResctrictions.forEach((res) =>
                result.push({
                    start: getUTCFromDateAndLocalTimeString(date, res.startTime),
                    end: getUTCFromDateAndLocalTimeString(date, res.endTime),
                })
            );
        }

        if (oneoffPartialRestrictions.length !== 0) {
            oneoffPartialRestrictions.forEach((res) => {
                result.push({
                    start: getUTCFromDateAndLocalTimeString(parse(res.date, "yyyy-MM-dd", new Date()), res.startTime),
                    end: getUTCFromDateAndLocalTimeString(parse(res.date, "yyyy-MM-dd", new Date()), res.endTime),
                });
            });
        }

        this.sortIntervalList(result);
        let i = 0;
        while (i + 1 < result.length) {
            if (areIntervalsOverlapping(result[i], result[i + 1]) || isSameSecond(result[i].end, result[i + 1].start)) {
                result.splice(i, 2, {
                    start: result[i].start < result[i + 1].start ? result[i].start : result[i + 1].start,
                    end: result[i].end > result[i + 1].end ? result[i].end : result[i + 1].end,
                });
            } else {
                i++;
            }
        }

        return result;
    }

    async getSuitableNotBookedIntervals(minutesNeeded, reservationsList, startOfBusiness, endOfBusiness) {
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

    async getServiceRequired(serviceId) {
        return await ServicesRepository.getServiceRequired(serviceId);
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
    sortIntervalList(intervalList) {
        return intervalList.sort((resA, resB) => {
            if (resA.startTime < resB.date) {
                return -1;
            } else {
                return 1;
            }
        });
    }
}

export default new ServicesService();
