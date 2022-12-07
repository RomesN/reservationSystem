import models from "../model/index.mjs";

class CustomerRepository {
    async getCustomerByData(firstName, lastName, email, telephoneNumber) {
        return await models.Customer.findOne({ where: { firstName, lastName, email, telephoneNumber } });
    }

    async createCustomer(firstName, lastName, telephoneNumber, email) {
        return await models.Customer.create({ firstName, lastName, telephoneNumber, email });
    }

    async deleteCustomerById(customerId) {
        return await models.Customer.destroy(customerId);
    }
}

export default new CustomerRepository();
