import { add, isAfter } from "date-fns";
import schedule from "node-schedule";
import enums from "../model/enums/index.mjs";
import { CustomerRepository } from "../repositories/index.mjs";
import { CoveredError, formatEmail, formatName, formatPhone } from "../utils/index.mjs";

class CustomerService {
    constructor(CustomerRepository) {
        this.CustomerRepository = CustomerRepository;
    }

    async createIfNotExists(firstName, lastName, email, phone) {
        if (!firstName || !lastName || !phone || !email) {
            throw new CoveredError(400, "One or more parameters is missing.");
        }

        const { firstFormatted, lastFormatted, emailFormatted, phoneFormatted } = this.formatPersonalData(
            firstName,
            lastName,
            email,
            phone
        );

        this.checkPersonalDataConstrains(firstFormatted, lastFormatted, emailFormatted, phoneFormatted);

        let customer = await this.CustomerRepository.getCustomerByData(
            firstFormatted,
            lastFormatted,
            emailFormatted,
            phoneFormatted
        );

        if (!customer) {
            const newCustomer = {
                firstName: firstFormatted,
                lastName: lastFormatted,
                email: emailFormatted,
                telephoneNumber: phoneFormatted,
                customerStatus: enums.status.ACTIVE,
            };

            customer = await this.CustomerRepository.createCustomer(newCustomer);
        }

        return customer;
    }

    async rescheduleCustomerDeletition(customer) {
        const latestReservation = await this.getLatestReservation(customer);
        schedule.cancelJob(customer.scheduledJobId);
        customer.scheduledJobId = this.scheduleCustomerDeletion(customer, latestReservation);
        return await this.CustomerRepository.updateCustomer(customer.id, {
            scheduledJobId: customer.scheduledJobId,
        });
    }

    formatPersonalData(firstName, lastName, email, phone) {
        const firstFormatted = formatName(firstName);
        const lastFormatted = formatName(lastName);
        const emailFormatted = formatEmail(email);
        const phoneFormatted = formatPhone(phone);
        return { firstFormatted, lastFormatted, emailFormatted, phoneFormatted };
    }

    checkPersonalDataConstrains(firstName, lastName, email, phone) {
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

    async getLatestReservation(customer) {
        const reservations = await customer.getReservations();

        let reservationLatest;
        for (let i = 0; i < reservations.length; i++) {
            if (!reservationLatest || isAfter(reservations[i].validityEnd, reservationLatest.validityEnd)) {
                reservationLatest = reservations[i];
            }
        }
        return reservationLatest;
    }

    async deleteCustomerWithInvalidReservations(customerInspected) {
        const customer = await this.CustomerRepository.getCustomerByData(
            customerInspected.firstName,
            customerInspected.lastName,
            customerInspected.email,
            customerInspected.phone
        );
        const now = new Date();
        const reservations = customer.getReservations();

        let validFound = false;
        for (let i = 0; i < reservations.length; i++) {
            if (isAfter(reservations[i].validityEnd, now)) {
                validFound = true;
            }
        }

        if (!validFound) {
            this.CustomerRepository.deleteCustomerById(customer.id);
        }

        return !validFound;
    }

    scheduleCustomerDeletion(customer, reservation) {
        return schedule.scheduleJob(
            add(reservation.validityEnd, { minutes: reservation.getService().minutesRequired }),
            () => {
                this.deleteCustomerWithInvalidReservations(customer);
            }
        ).name;
    }
}

export default new CustomerService(CustomerRepository);
