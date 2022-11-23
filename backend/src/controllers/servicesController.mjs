import { ServicesService } from "../services/index.mjs";
import { okJsonResponse } from "../utils/index.mjs";

class ServicesController {
    constructor(ServicesService) {
        this.ServicesService = ServicesService;
    }

    async getAllServices(req, res, next) {
        try {
            const data = await this.ServicesService.getServicesList();
            return res.json(okJsonResponse("Following services available.", data));
        } catch (error) {
            next(error);
        }
    }
}

export default new ServicesController(ServicesService);
