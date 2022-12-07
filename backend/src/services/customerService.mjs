import { add, isAfter } from "date-fns";
import schedule from "node-schedule";
import enums from "../model/enums/index.mjs";
import { CustomerRepository } from "../repositories/index.mjs";
import { CoveredError, formatEmail, formatName, formatPhone } from "../utils/index.mjs";

class CustomerService {
    constructor(CustomerRepository) {
        this.CustomerRepository = CustomerRepository;
    }

    async createCustomerIfNotExists(firstName, lastName, phone, email, reservation) {
        if (!firstName || !lastName || !phone || !email) {
            throw new CoveredError(400, "One or more parameters is missing.");
        }

        const { firstFormatted, lastFormatted, phoneFormatted, emailFormatted } = this.formatPersonalData(
            firstName,
            lastName,
            email,
            phone
        );

        this.checkPersonalDataConstrains(firstFormatted, lastFormatted, phoneFormatted, emailFormatted);

        let customer = await this.CustomerRepository.getCustomerByData(firstName, lastName, phone, email);

        if (!customer) {
            customer = this.CustomerRepository.createCustomer(firstName, lastName, phone, email, enums.status.ACTIVE);
        }

        schedule.scheduleJob(add(reservation.date, { minutes: reservation.getService().minutesRequired }), () => {
            this.deleteCustomerWithInvalidReservations(customer);
        });

        return customer;
    }

    formatPersonalData(firstName, lastName, phone, email) {
        const firstFormatted = formatName(firstName);
        const lastFormatted = formatName(lastName);
        const phoneFormatted = formatPhone(phone);
        const emailFormatted = formatEmail(email);
        return { firstFormatted, lastFormatted, phoneFormatted, emailFormatted };
    }

    checkPersonalDataConstrains(firstName, lastName, phone, email) {
        if (!/[A-Za-z]{2}/g.test(firstName) || !/[A-Za-z]{2}/g.test(lastName)) {
            throw new CoveredError(400, "First and last name has to contain at leat 2 characters.");
        }

        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/g.test(email)) {
            throw new CoveredError(400, "Email address is not valid.");
        }

        if (!/^(\+42[0-1])? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/g.test(phone)) {
            throw new CoveredError(400, "The number is not valid SK/CZ phone number.");
        }
    }

    async deleteCustomerWithInvalidReservations(customerInspected) {
        const customer = await this.CustomerRepository.getCustomerByData(
            customerInspected.firstName,
            customerInspected.lastName,
            customerInspected.email,
            customerInspected.phone
        );
        const now = new Date();
        const reservations = customer.getServices();

        let validFound = false;
        for (let i = 0; i < reservations.length(); i++) {
            if (isAfter(reservations[i].validitEnd, now)) {
                validFound = true;
            }
        }
        if (!validFound) {
            this.CustomerRepository.deleteCustomerById(customer.id);
        }
        return !validFound;
    }
}

export default new CustomerService(CustomerRepository);
