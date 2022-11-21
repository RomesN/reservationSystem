import { Op } from "sequelize";
import models from "../model/index.mjs";

class ReservationsRepository {
    async getReservationsBetween(startDate, endDate) {
        const where = {
            date: {
                [Op.between]: [startDate, endDate],
            },
        };

        return await models.Reservation.findAll({ where });
    }
}

export default new ReservationsRepository();
