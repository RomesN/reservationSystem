import { Op } from "sequelize";
import { format } from "date-fns";
import models from "../model/index.mjs";
import enums from "../model/enums/index.mjs";

class RestrictionsRepository {
    constructor(models, Op) {
        this.models = models;
        this.Op = Op;
    }

    async createBusinessClosedRestriction(restriction) {
        return await this.models.Restriction.create(restriction);
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

    async getAllRegularBrakes() {
        return await this.models.Restriction.findAll({
            where: { restrictionType: enums.restrictionType.REGULAR_BREAK },
        });
    }

    async getAllWholeDayRestrictionBetweenDates(startDate, endDate) {
        const where = {
            date: {
                [this.Op.between]: [startDate, endDate],
            },
            restrictionType: enums.restrictionType.BUSINESS_CLOSED,
        };

        return await this.models.Restriction.findAll({ where });
    }

    async getBusinessClosedById(id) {
        return await this.models.Restriction.findOne({
            where: { id, restrictionType: enums.restrictionType.BUSINESS_CLOSED },
        });
    }

    async getBusinessClosedByDate(date) {
        const where = {
            date: format(date, "yyyy-MM-dd"),
            restrictionType: enums.restrictionType.BUSINESS_CLOSED,
        };

        return await this.models.Restriction.findOne({ where });
    }

    async getBusinessClosedByDateString(date) {
        const where = {
            date: date,
            restrictionType: enums.restrictionType.BUSINESS_CLOSED,
        };

        return await this.models.Restriction.findOne({ where });
    }

    async getGeneralPartialDayRestrictions(weekday) {
        return await this.models.Restriction.findAll({
            where: { restrictionType: enums.restrictionType.INTERVAL_CLSOED, weekday: weekday },
        });
    }

    async getOneoffPartialDayRestrictions(date) {
        const where = {
            date: format(date, "yyyy-MM-dd"),
            restrictionType: enums.restrictionType.INTERVAL_CLSOED,
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

    async updateRegularBrake(data) {
        const where = {
            restrictionType: enums.restrictionType.REGULAR_BREAK,
            weekday: data.weekday,
        };

        const update = {
            startTime: data.startTime,
            endTime: data.endTime,
        };

        return await this.models.Restriction.update(update, { where });
    }

    async updateBusinessClosedById(data, id) {
        const where = {
            restrictionType: enums.restrictionType.BUSINESS_CLOSED,
            id: id,
        };

        return await this.models.Restriction.update(data, { where });
    }

    async deleteBusinessClosedById(id) {
        return await models.Restriction.destroy({ where: { id }, force: true });
    }
}

export default new RestrictionsRepository(models, Op);
