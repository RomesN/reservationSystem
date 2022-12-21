import { areIntervalsOverlapping, isSameSecond, parse, parseISO } from "date-fns";
import schedule from "node-schedule";
import {
    daysOfTheWeekNum,
    getDaysInMonth,
    getWeekdayNumberMonIsOne,
    getUTCFromDateAndLocalTimeString,
    sortIntervalList,
    CoveredError,
} from "../utils/index.mjs";
import { RestrictionsRepository } from "../repositories/index.mjs";
import enums from "../model/enums/index.mjs";

class RestrictionsService {
    constructor(RestrictionsRepository) {
        this.RestrictionsRepository = RestrictionsRepository;
    }

    async createBusinessClosedRestriction(date) {
        if (!date) {
            throw new CoveredError(400, "Missing input.");
        }

        const year = parseInt(date.substring(0, 4));
        const month = parseInt(date.substring(5, 7));
        const day = parseInt(date.substring(8));

        if (
            Number.isNaN(year) ||
            Number.isNaN(month) ||
            Number.isNaN(day) ||
            date.substring(4, 5) !== "-" ||
            date.substring(7, 8) !== "-"
        ) {
            throw new CoveredError(400, "Wrong format.");
        }

        // if exists do not create
        const existingRestriction = await this.RestrictionsRepository.getBusinessClosedByDateString(date);

        if (existingRestriction) {
            throw new CoveredError(400, "The restriction already exists.");
        } else {
            const createdRestriction = await this.RestrictionsRepository.createBusinessClosedRestriction({
                date: date,
                restrictionType: enums.restrictionType.BUSINESS_CLOSED,
            });

            // scheduling deletion

            createdRestriction.scheduledDeletionJobId = schedule.scheduleJob(
                new Date(Date.UTC(year, month, day + 1, 0, 0, 0)),
                () => {
                    this.deleteBusinessClosedByid(createdRestriction.id);
                }
            ).name;

            // saving the job name

            await this.RestrictionsRepository.updateBusinessClosedById(
                { scheduledDeletionJobId: createdRestriction.scheduledDeletionJobId },
                createdRestriction.id
            );
            return createdRestriction;
        }
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

    async getAllWholeDayRestrictionBetweenDates(year, month) {
        if (!year || !month) {
            throw new CoveredError(400, "Inputs missing.");
        }

        const yearAsNumber = parseInt(year);
        const monthAsNumber = parseInt(month);

        if (Number.isNaN(yearAsNumber) || Number.isNaN(monthAsNumber)) {
            throw new CoveredError(400, "Invalid format of inputs.");
        }

        return await this.RestrictionsRepository.getAllWholeDayRestrictionBetweenDates(
            new Date(yearAsNumber, monthAsNumber - 1, 1, 0, 0, 0),
            new Date(yearAsNumber, monthAsNumber - 1, getDaysInMonth(yearAsNumber, monthAsNumber), 23, 59, 59)
        );
    }

    async getGeneralPartialDayRestrictions(date) {
        return await this.RestrictionsRepository.getGeneralPartialDayRestrictions(
            daysOfTheWeekNum[getWeekdayNumberMonIsOne(date)]
        );
    }

    async getOneoffPartialDayRestrictions(date) {
        return await this.RestrictionsRepository.getOneoffPartialDayRestrictions(date);
    }

    getUpdateObject(restrictionReceived) {
        const startTimeDate = parseISO(restrictionReceived.startTime);
        const endTimeDate = parseISO(restrictionReceived.endTime);

        const updateObject = { weekday: restrictionReceived.weekday };

        if (startTimeDate.toString() === "Invalid Date" || endTimeDate.toString() === "Invalid Date") {
            updateObject.startTime = null;
        } else {
            updateObject.endTime = null;
            const startHours =
                startTimeDate.getHours() < 10 ? `0${startTimeDate.getHours()}` : `${startTimeDate.getHours()}`;
            const endHours = endTimeDate.getHours() < 10 ? `0${endTimeDate.getHours()}` : `${endTimeDate.getHours()}`;
            const startMinutes =
                startTimeDate.getMinutes() < 10 ? `0${startTimeDate.getMinutes()}` : `${startTimeDate.getMinutes()}`;
            const endMinutes =
                endTimeDate.getMinutes() < 10 ? `0${endTimeDate.getMinutes()}` : `${endTimeDate.getMinutes()}`;

            updateObject.startTime = `${startHours}:${startMinutes}:00`;
            updateObject.endTime = `${endHours}:${endMinutes}:00`;
        }
        return updateObject;
    }

    async getBusinessClosedByDate(date) {
        return await this.RestrictionsRepository.getBusinessClosedByDate(date);
    }

    async updateBusinessHours(businessHours) {
        if (!businessHours) {
            throw new CoveredError(400, "No business hours provided.");
        }

        if (!Array.isArray(businessHours)) {
            throw new CoveredError(400, "Data should be provided as array.");
        }

        businessHours.forEach(async (day) => {
            await this.RestrictionsRepository.updateBusinessHours(this.getUpdateObject(day));
        });

        return true;
    }

    async updateRegularBrakes(regularBrakes) {
        if (!regularBrakes) {
            throw new CoveredError(400, "No regular brakes provided.");
        }

        if (!Array.isArray(regularBrakes)) {
            throw new CoveredError(400, "Data should be provided as array.");
        }

        regularBrakes.forEach(async (brake) => {
            await this.RestrictionsRepository.updateRegularBrake(this.getUpdateObject(brake));
        });

        return true;
    }

    async deleteBusinessClosedByid(id) {
        return await this.RestrictionsRepository.deleteBusinessClosedById(id);
    }

    async deleteBusinessClosedByidAndDeleteJob(id) {
        const restriction = await this.RestrictionsRepository.getBusinessClosedById(id);
        if (!schedule.cancelJob(restriction.scheduledDeletionJobId)) {
            throw new CoveredError(500, "Job cancelation for the restriction failed.");
        }
        return await this.deleteBusinessClosedByid(id);
    }
}

export default new RestrictionsService(RestrictionsRepository);
