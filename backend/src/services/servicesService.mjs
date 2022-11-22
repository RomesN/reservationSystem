import { CoveredError } from "../utils/index.mjs";
import { ServicesRepository } from "../repositories/index.mjs";

class ServicesService {
    constructor(ServicesRepository) {
        this.ServicesRepository = ServicesRepository;
    }

    async getServicesList() {
        const services = await this.ServicesRepository.getServicesList();
        if (!services) {
            throw new CoveredError(204, "No services available");
        }
        return services;
    }

    async getServiceRequired(serviceId) {
        if (!serviceId) {
            throw new CoveredError(400, "One or more missing arguments.");
        }

        const serviceIdAsNumber = parseInt(serviceId);

        if (!Number.isInteger(serviceIdAsNumber)) {
            throw new CoveredError(400, "Input in wrong format.");
        }

        const service = await this.ServicesRepository.getServiceRequired(serviceIdAsNumber);

        if (!service) {
            throw new CoveredError(400, "Service with given ID does not exist.");
        }

        return service;
    }
}

export default new ServicesService(ServicesRepository);
