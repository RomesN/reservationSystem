import models from "../model/index.mjs";

class ServicesRepository {
    constructor(models) {
        this.models = models;
    }
    async getServicesList() {
        return await this.models.Service.findAll();
    }

    async getServiceRequired(serviceId) {
        return await this.models.Service.findOne({ where: { id: serviceId } });
    }
}

export default new ServicesRepository(models);
