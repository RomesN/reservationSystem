import { Op } from "sequelize";
import enums from "../model/enums/index.mjs";
import models from "../model/index.mjs";

class ReservationsRepository {
    async getReservationsBetween(startDate, endDate) {
        const where = {
            date: {
                [Op.between]: [startDate, endDate],
            },
            reservationStatus: enums.status.ACTIVE,
        };

        return await models.Reservation.findAll({ where });
    }
}

export default new ReservationsRepository();
