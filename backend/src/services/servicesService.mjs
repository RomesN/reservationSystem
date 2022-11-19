import { ServicesRepository } from "../repositories/index.mjs";
import { CoveredError } from "../utils/index.mjs";

class ServicesService {
    constructor(ServicesRepository) {
        this.ServicesRepository = ServicesRepository;
    }

    async getServicesList() {
        const services = await ServicesRepository.getServicesList();
        if (!services) {
            throw new CoveredError(204, "No services available");
        }
        return services;
    }
}

export default new ServicesService();
