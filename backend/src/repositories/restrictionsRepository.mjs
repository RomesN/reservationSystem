import { format } from "date-fns";
import models from "../model/index.mjs";
import enums from "../model/enums/index.mjs";

class RestrictionsRepository {
    constructor(models) {
        this.models = models;
    }
    async getServicesList() {
        return await this.models.Service.findAll();
    }

    async getBusinessHours(weekday) {
        return await this.models.Restriction.findOne({
            where: { restrictionType: enums.restrictionType.BUSINESS_HOURS, weekday: weekday },
        });
    }

    async getAllBusinessHours() {
        return await this.models.Restriction.findAll({
            where: { restrictionType: enums.restrictionType.BUSINESS_HOURS },
        });
    }

    async getWholeDayRestriction(date) {
        const where = {
            date: format(date, "yyyy-MM-dd"),
            restrictionType: enums.restrictionType.WHOLE_DAY_BUSINESS_CLOSED,
        };

        return await this.models.Restriction.findOne({ where });
    }

    async getGeneralPartialDayRestrictions(weekday) {
        return await this.models.Restriction.findAll({
            where: { restrictionType: enums.restrictionType.GENERAL_PARTIAL_BUSINESS_CLOSED, weekday: weekday },
        });
    }

    async getOneoffPartialDayRestrictions(date) {
        const where = {
            date: format(date, "yyyy-MM-dd"),
            restrictionType: enums.restrictionType.ONEOFF_PARTIAL_BUSINESS_CLOSED,
        };

        return await this.models.Restriction.findAll({ where });
    }

    async updateBusinessHours(data) {
        const where = {
            restrictionType: enums.restrictionType.BUSINESS_HOURS,
            weekday: data.weekday,
        };

        const update = {
            startTime: data.startTime,
            endTime: data.endTime,
        };

        return await this.models.Restriction.update(update, { where });
    }
}

export default new RestrictionsRepository(models);
