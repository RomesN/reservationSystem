import { Op } from "sequelize";
import enums from "../model/enums/index.mjs";
import models from "../model/index.mjs";

class ReservationsRepository {
    async createReservation(reservation) {
        return await models.Reservation.create(reservation);
    }

    async getValidReservationsBetween(startDate, endDate) {
        const where = {
            date: {
                [Op.between]: [startDate, endDate],
            },
            validityEnd: {
                [Op.gte]: new Date(),
            },
            reservationStatus: { [Op.or]: [enums.status.ACTIVE, enums.status.TEMPORARY] },
        };

        return await models.Reservation.findAll({ where });
    }

    async getReservationByToken(token) {
        return await models.Reservation.findOne({ where: { reservationToken: token } });
    }

    async deleteReservationByToken(token) {
        await models.Reservation.destroy({
            where: { reservationToken: token },
            force: true,
        });
    }
}

export default new ReservationsRepository();
