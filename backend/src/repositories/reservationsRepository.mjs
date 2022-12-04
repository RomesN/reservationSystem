import { Op } from "sequelize";
import enums from "../model/enums/index.mjs";
import models from "../model/index.mjs";

class ReservationsRepository {
    async getValidReservationsBetween(startDate, endDate) {
        const where = {
            date: {
                [Op.between]: [startDate, endDate],
            },
            reservationStatus: { [Op.or]: [enums.status.ACTIVE, enums.status.TEMPORARY] },
        };

        return await models.Reservation.findAll({ where });
    }

    async createReservation(reservation) {
        return await models.Reservation.create(reservation);
    }

    async deleteTemporalReservation(date, detail) {
        await models.Reservation.destroy({
            where: { date, detail },
            force: true,
        });
    }
}

export default new ReservationsRepository();
