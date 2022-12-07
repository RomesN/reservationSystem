import models from "../model/index.mjs";

class CustomerRepository {
    async getCustomerByData(firstName, lastName, telephoneNumber, email) {
        return await models.Customer.findOne({ where: { firstName, lastName, telephoneNumber, email } });
    }

    async createCustomer(firstName, lastName, telephoneNumber, email, customerStatus) {
        return await models.Customer.create({ firstName, lastName, telephoneNumber, email, customerStatus });
    }

    async deleteCustomerById(customerId) {
        return await models.Customer.destroy(customerId);
    }
}

export default new CustomerRepository();
