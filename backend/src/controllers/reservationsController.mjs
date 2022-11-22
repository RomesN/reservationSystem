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
        const month = req.query.month;
        const year = req.query.year;

        try {
            const serviceRequired = await ServicesService.getServiceRequired(serviceId);
            const infoObject = await ReservationsService.getMonthServiceInfoObject(
                serviceRequired,
                year,
                month,
                RestrictionsService
            );
            return res.json(okJsonResponse("Free slots with month and service info can be found bewlow.", infoObject));
        } catch (error) {
            next(error);
        }
    }
}

export default new ReservationsController(ReservationsService, RestrictionsService, ServicesService);
