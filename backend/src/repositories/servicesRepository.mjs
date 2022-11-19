import models from "../model/index.mjs";

class ServicesRepository {
    async getServicesList() {
        return await models.Service.findAll();
    }
}

export default new ServicesRepository();
