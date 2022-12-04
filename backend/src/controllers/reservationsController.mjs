import "dotenv";
import { ReservationsService, RestrictionsService, ServicesService } from "../services/index.mjs";
import { okJsonResponse } from "../utils/index.mjs";

class ReservationsController {
    constructor(ReservationsService, RestrictionsService, ServicesService) {
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

    async createNewTemporalBooking(req, res, next) {
        const serviceId = req.params.serviceId;
        const isoTimeString = req.params.isoTimeString;

        try {
            const temporalBooking = await this.ReservationsService.createNewTemporalBooking(
                isoTimeString,
                serviceId,
                this.ServicesService
            );
            return res.json(
                okJsonResponse(
                    `Temporal booking was created. Date is reserved for ${
                        process.env.BOOKING_TEMPORAL_RESERVATION_VALIDITY || 15
                    } minutes.`,
                    temporalBooking
                )
            );
        } catch (error) {
            next(error);
        }
    }
}

export default new ReservationsController(ReservationsService, RestrictionsService, ServicesService);
