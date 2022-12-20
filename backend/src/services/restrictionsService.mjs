import { areIntervalsOverlapping, isSameSecond, parse, parseISO } from "date-fns";
import {
    daysOfTheWeekNum,
    getWeekdayNumberMonIsOne,
    getUTCFromDateAndLocalTimeString,
    sortIntervalList,
    CoveredError,
} from "../utils/index.mjs";
import { RestrictionsRepository } from "../repositories/index.mjs";

class RestrictionsService {
    constructor(RestrictionsRepository) {
        this.RestrictionsRepository = RestrictionsRepository;
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

        sortIntervalList(result);

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

    async getBusinessHours(date) {
        return await this.RestrictionsRepository.getBusinessHours(daysOfTheWeekNum[getWeekdayNumberMonIsOne(date)]);
    }

    async getAllBusinessHours() {
        return await this.RestrictionsRepository.getAllBusinessHours();
    }

    async getAllRegularBrakes() {
        return await this.RestrictionsRepository.getAllRegularBrakes();
    }

    async getGeneralPartialDayRestrictions(date) {
        return await this.RestrictionsRepository.getGeneralPartialDayRestrictions(
            daysOfTheWeekNum[getWeekdayNumberMonIsOne(date)]
        );
    }

    async getOneoffPartialDayRestrictions(date) {
        return await this.RestrictionsRepository.getOneoffPartialDayRestrictions(date);
    }

    async getWholeDayRestriction(date) {
        return await this.RestrictionsRepository.getWholeDayRestriction(date);
    }

    async updateBusinessHours(businessHours) {
        if (!businessHours) {
            throw new CoveredError("No business hours provided.");
        }

        if (!Array.isArray(businessHours)) {
            throw new CoveredError("Data should be provided as array.");
        }

        businessHours.forEach(async (day) => {
            const startTimeDate = parseISO(day.startTime);
            const endTimeDate = parseISO(day.endTime);

            const updateObject = { weekday: day.weekday };

            if (startTimeDate.toString() === "Invalid Date" || endTimeDate.toString() === "Invalid Date") {
                updateObject.startTime = null;
                updateObject.endTime = null;
            } else {
                const startHours =
                    startTimeDate.getHours() < 10 ? `0${startTimeDate.getHours()}` : `${startTimeDate.getHours()}`;
                const endHours =
                    endTimeDate.getHours() < 10 ? `0${endTimeDate.getHours()}` : `${endTimeDate.getHours()}`;
                const startMinutes =
                    startTimeDate.getMinutes() < 10
                        ? `0${startTimeDate.getMinutes()}`
                        : `${startTimeDate.getMinutes()}`;
                const endMinutes =
                    endTimeDate.getMinutes() < 10 ? `0${endTimeDate.getMinutes()}` : `${endTimeDate.getMinutes()}`;

                updateObject.startTime = `${startHours}:${startMinutes}:00`;
                updateObject.endTime = `${endHours}:${endMinutes}:00`;
            }

            await this.RestrictionsRepository.updateBusinessHours(updateObject);
        });

        return true;
    }

    async updateRegularBrakes(regularBrakes) {
        if (!regularBrakes) {
            throw new CoveredError("No business hours provided.");
        }

        if (!Array.isArray(regularBrakes)) {
            throw new CoveredError("Data should be provided as array.");
        }

        regularBrakes.forEach(async (brake) => {
            const startTimeDate = parseISO(brake.startTime);
            const endTimeDate = parseISO(brake.endTime);

            const updateObject = { weekday: brake.weekday };

            if (startTimeDate.toString() === "Invalid Date" || endTimeDate.toString() === "Invalid Date") {
                updateObject.startTime = null;
                updateObject.endTime = null;
            } else {
                const startHours =
                    startTimeDate.getHours() < 10 ? `0${startTimeDate.getHours()}` : `${startTimeDate.getHours()}`;
                const endHours =
                    endTimeDate.getHours() < 10 ? `0${endTimeDate.getHours()}` : `${endTimeDate.getHours()}`;
                const startMinutes =
                    startTimeDate.getMinutes() < 10
                        ? `0${startTimeDate.getMinutes()}`
                        : `${startTimeDate.getMinutes()}`;
                const endMinutes =
                    endTimeDate.getMinutes() < 10 ? `0${endTimeDate.getMinutes()}` : `${endTimeDate.getMinutes()}`;

                updateObject.startTime = `${startHours}:${startMinutes}:00`;
                updateObject.endTime = `${endHours}:${endMinutes}:00`;
            }

            await this.RestrictionsRepository.updateRegularBrake(updateObject);
        });

        return true;
    }
}

export default new RestrictionsService(RestrictionsRepository);
