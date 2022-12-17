import { Op } from "sequelize";
import models from "../model/index.mjs";
import enums from "../model/enums/index.mjs";

class AdminRepository {
    constructor(models, Op) {
        this.models = models;
        this.Op = Op;
    }

    async getActiveAdminByLogin(login) {
        const where = {
            [this.Op.or]: [{ username: login }, { email: login }],
            adminStatus: enums.status.ACTIVE,
        };

        return await this.models.Admin.findOne({ where });
    }
}

export default new AdminRepository(models, Op);
