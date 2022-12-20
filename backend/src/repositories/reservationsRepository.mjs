import { Op } from "sequelize";
import enums from "../model/enums/index.mjs";
import models from "../model/index.mjs";

class ReservationsRepository {
    constructor(models, Op) {
        this.models = models;
        this.Op = Op;
    }

    async createReservation(reservation) {
        return await this.models.Reservation.create(reservation);
    }

    async getValidReservationsBetween(startDate, endDate) {
        const where = {
            date: {
                [this.Op.between]: [startDate, endDate],
            },
            validityEnd: {
                [this.Op.gte]: new Date(),
            },
            reservationStatus: { [this.Op.or]: [enums.status.ACTIVE, enums.status.TEMPORARY] },
        };

        return await this.models.Reservation.findAll({ where });
    }

    async getActiveReservationsBetween(startDate, endDate) {
        const where = {
            date: {
                [this.Op.between]: [startDate, endDate],
            },
            validityEnd: {
                [this.Op.gte]: new Date(),
            },
            reservationStatus: { [this.Op.or]: [enums.status.ACTIVE] },
        };

        return await this.models.Reservation.findAll({
            include: [{ model: this.models.Customer }, { model: this.models.Service }],
            where,
        });
    }

    async getReservationByToken(token) {
        return await this.models.Reservation.findOne({ where: { reservationToken: token } });
    }

    async getActiveReservationByToken(token) {
        const where = {
            reservationToken: token,
            reservationStatus: enums.status.ACTIVE,
        };
        return await this.models.Reservation.findOne({ where });
    }

    async getTemporaryReservationByToken(token) {
        return await this.models.Reservation.findOne({
            where: {
                reservationToken: token,
                reservationStatus: enums.status.TEMPORARY,
            },
        });
    }

    async updateReservation(id, updateData) {
        return await this.models.Reservation.update(updateData, {
            where: { id },
        });
    }

    async deleteReservationByToken(token) {
        await this.models.Reservation.destroy({
            where: { reservationToken: token },
            force: true,
        });
    }
}

export default new ReservationsRepository(models, Op);
