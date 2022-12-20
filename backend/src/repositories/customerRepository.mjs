import models from "../model/index.mjs";

class CustomerRepository {
    constructor(models) {
        this.models = models;
    }
    async getCustomerByData(firstName, lastName, email, telephoneNumber) {
        return await this.models.Customer.findOne({ where: { firstName, lastName, email, telephoneNumber } });
    }

    async getCustomerByReservationToken(token) {
        return await this.models.Customer.findOne({
            include: [
                {
                    model: this.models.Reservation,
                    where: { reservationToken: token },
                },
            ],
        });
    }

    async createCustomer(newCustomer) {
        return await this.models.Customer.create(newCustomer);
    }

    async updateCustomer(id, updateData) {
        return await this.models.Customer.update(updateData, {
            where: { id },
        });
    }

    async deleteCustomerById(customerId) {
        return await this.models.Customer.destroy({
            where: { id: customerId },
            force: true,
        });
    }
}

export default new CustomerRepository(models);
