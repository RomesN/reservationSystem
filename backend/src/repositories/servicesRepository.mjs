import models from "../model/index.mjs";

class ServicesRepository {
    async getServicesList() {
        return await models.Service.findAll();
    }

    async getServiceRequired(serviceId) {
        return await models.Service.findOne({ where: { id: serviceId } });
    }
}

export default new ServicesRepository();
