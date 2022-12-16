import "dotenv";
import {
    CustomerService,
    NotificationService,
    ReservationsService,
    RestrictionsService,
    ServicesService,
} from "../services/index.mjs";
import { okJsonResponse } from "../utils/index.mjs";

class ReservationsController {
    constructor(CustomerService, NotificationService, ReservationsService, RestrictionsService, ServicesService) {
        this.CustomerService = CustomerService;
        this.NotificationService = NotificationService;
        this.ReservationsService = ReservationsService;
        this.RestrictionsService = RestrictionsService;
        this.ServicesService = ServicesService;
    }

    async getAvailableDays(req, res, next) {
        const serviceId = req.params.serviceId;
        const year = req.params.year;
        const month = req.params.month;

        try {
            const serviceRequired = await this.ServicesService.getServiceRequired(serviceId);
            const infoObject = await this.ReservationsService.getMonthServiceInfoObject(
                serviceRequired,
                year,
                month,
                RestrictionsService
            );
            return res.json(
                okJsonResponse(
                    "Free slots with month and service info can be found below. Months numbered on scale 1-12.",
                    infoObject
                )
            );
        } catch (error) {
            next(error);
        }
    }

    async getAvailabilityInfo(req, res, next) {
        const serviceId = req.params.serviceId;
        const isoTimeString = req.params.isoTimeString;

        try {
            const service = await this.ServicesService.getServiceRequired(serviceId);
            const result = await this.ReservationsService.getIsDateAvailable(
                isoTimeString,
                service.minutesRequired,
                this.RestrictionsService
            );
            return res.json(
                okJsonResponse(result ? "The date is available." : "The date is NOT available.", {
                    isAvailable: result,
                })
            );
        } catch (error) {
            next(error);
        }
    }

    async createNewTemporalReservation(req, res, next) {
        const serviceId = req.params.serviceId;
        const isoTimeString = req.params.isoTimeString;

        try {
            const temporalBooking = await this.ReservationsService.createNewTemporalReservation(
                isoTimeString,
                serviceId,
                this.ServicesService,
                this.RestrictionsService
            );
            return res.json(
                okJsonResponse(
                    `Temporal reservation was created. Date is booked for ${
                        process.env.BOOKING_TEMPORAL_RESERVATION_VALIDITY || 15
                    } minutes.`,
                    { temporalBooking }
                )
            );
        } catch (error) {
            next(error);
        }
    }

    async createFinalReservation(req, res, next) {
        const { reservationToken } = req.params;
        const { firstName, lastName, email, phone } = req.body;

        try {
            const temporalReservation = await this.ReservationsService.getTemporalReservationByToken(reservationToken);
            const customer = await this.CustomerService.createIfNotExists(
                firstName,
                lastName,
                email,
                phone,
                temporalReservation
            );
            await this.ReservationsService.makeReservationFinal(temporalReservation, customer);
            await this.CustomerService.rescheduleCustomerDeletition(customer);

            const finalBooking = await this.ReservationsService.getActiveReservationByToken(reservationToken);
            const scheduledReminderJobId = await this.NotificationService.scheduleReminder(finalBooking, 60 * 24);
            if (scheduledReminderJobId) {
                await this.ReservationsService.updateReservation(finalBooking.id, { scheduledReminderJobId });
            }

            const iCalObject = await this.NotificationService.getIcalObjectInstance(finalBooking);
            await this.NotificationService.sendNewReservationEmail(finalBooking, iCalObject);

            return res.json(okJsonResponse(`The reservation was finalized.`, finalBooking));
        } catch (error) {
            next(error);
        }
    }

    async deleteTemporalReservation(req, res, next) {
        const { reservationToken } = req.params;

        try {
            await this.ReservationsService.deleteTemporalReservation(reservationToken);
            return res.json(okJsonResponse(`Temporal reservation was deleted.`));
        } catch (error) {
            next(error);
        }
    }
}

export default new ReservationsController(
    CustomerService,
    NotificationService,
    ReservationsService,
    RestrictionsService,
    ServicesService
);
