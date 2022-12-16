import models from "../model/index.mjs";

class CustomerRepository {
    async getCustomerByData(firstName, lastName, email, telephoneNumber) {
        return await models.Customer.findOne({ where: { firstName, lastName, email, telephoneNumber } });
    }

    async createCustomer(newCustomer) {
        return await models.Customer.create(newCustomer);
    }

    async updateCustomer(id, updateData) {
        return await models.Customer.update(updateData, {
            where: { id },
        });
    }

    async deleteCustomerById(customerId) {
        return await models.Customer.destroy(customerId);
    }
}

export default new CustomerRepository();
