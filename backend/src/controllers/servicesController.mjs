import { ServicesService } from "../services/index.mjs";
import { okJsonResponse } from "../utils/index.mjs";

class ServicesController {
    constructor(ServicesService) {
        this.ServicesService = ServicesService;
    }

    async getAllServices(req, res, next) {
        try {
            const data = await ServicesService.getServicesList();
            return res.json(okJsonResponse("Following services available.", data));
        } catch (error) {
            next(error);
        }
    }

    async getAvailableDays(req, res, next) {
        const serviceId = req.params.serviceId;
        const month = req.query.month;
        const year = req.query.year;
        try {
            const days = await ServicesService.getFreeIntervals(serviceId, year, month);
            return res.json(
                okJsonResponse(
                    "Date property is equal false if no available slot. Array with free slots otherwise.",
                    days
                )
            );
        } catch (error) {
            next(error);
        }
    }
}

export default new ServicesController();
