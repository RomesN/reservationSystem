import { areIntervalsOverlapping, isSameSecond, parse } from "date-fns";
import {
    daysOfTheWeekNum,
    getWeekdayNumberMonIsOne,
    getUTCFromDateAndLocalTimeString,
    sortIntervalList,
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
}

export default new RestrictionsService(RestrictionsRepository);
