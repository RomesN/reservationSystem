import { format } from "date-fns";
import models from "../model/index.mjs";
import enums from "../model/enums/index.mjs";

class RestrictionsRepository {
    async getServicesList() {
        return await models.Service.findAll();
    }

    async getBusinessHours(weekday) {
        return await models.Restriction.findOne({
            where: { restrictionType: enums.restrictionType.BUSINESS_HOURS, weekday: weekday },
        });
    }

    async getWholeDayRestriction(date) {
        const where = {
            date: format(date, "yyyy-MM-dd"),
            restrictionType: enums.restrictionType.WHOLE_DAY_BUSINESS_CLOSED,
        };

        return await models.Restriction.findOne({ where });
    }

    async getGeneralPartialDayRestrictions(weekday) {
        return await models.Restriction.findAll({
            where: { restrictionType: enums.restrictionType.GENERAL_PARTIAL_BUSINESS_CLOSED, weekday: weekday },
        });
    }

    async getOneoffPartialDayRestrictions(date) {
        const where = {
            date: format(date, "yyyy-MM-dd"),
            restrictionType: enums.restrictionType.ONEOFF_PARTIAL_BUSINESS_CLOSED,
        };

        return await models.Restriction.findAll({ where });
    }
}

export default new RestrictionsRepository();
