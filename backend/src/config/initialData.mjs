import bcrypt from "bcrypt";
import "dotenv/config";
import models from "../model/index.mjs";
import enums from "../model/enums/index.mjs";

export default async () => {
    //#region ---ENUMS INIT---

    // statuses
    let create = [];
    Object.values(enums.status).forEach((userStatus) => {
        create.push({ status: userStatus });
    });
    await models.Status.bulkCreate(create);

    // restriction type
    create.length = 0;
    Object.values(enums.restrictionType).forEach((restrictionType) => {
        create.push({ type: restrictionType });
    });
    await models.Type.bulkCreate(create);
    //#endregion ---ENUMS INIT---

    //#region ---SERVICES---
    await models.Service.bulkCreate([
        {
            name: "Eyelashes lamination",
            minutesRequired: 90,
        },
        {
            name: "Eyebrows shaping and lamination",
            minutesRequired: 40,
        },
        {
            name: "Eyebrows shaping and tinting",
            minutesRequired: 60,
        },
        {
            name: "Cosmetics procedures STANDARD",
            minutesRequired: 60,
        },
        {
            name: "Cosmetics procedures DELUXE",
            minutesRequired: 75,
        },
        {
            name: "Cosmetics procedures LUXE",
            minutesRequired: 90,
        },
    ]);
    //#endregion ---SERVICES---

    //#region ---CUSTOMER---
    await models.Customer.bulkCreate([
        {
            firstName: "Alexandra",
            lastName: "Doe",
            telephoneNumber: "+420444555666",
            email: "example@example.com",
            customerStatus: "Active",
        },
        {
            firstName: "John",
            lastName: "Doe",
            telephoneNumber: "+420111222333",
            email: "john.doe.example@example.com",
            customerStatus: "Active",
        },
        {
            firstName: "Gal",
            lastName: "Gadot",
            telephoneNumber: "+4206667777666",
            email: "galGadot@example.com",
            customerStatus: "Active",
        },
        {
            firstName: "Lara",
            lastName: "Croft",
            telephoneNumber: "+420444555666",
            email: "lara.croft@example.com",
            customerStatus: "Active",
        },
        {
            firstName: "Samantha",
            lastName: "Gardner",
            telephoneNumber: "+420444555666",
            email: "exampleSamantha@example.com",
            customerStatus: "Active",
        },
        {
            firstName: "Scarlett",
            lastName: "Johansson",
            telephoneNumber: "+420123456789",
            email: "scarlett.johansson@example.com",
            customerStatus: "Active",
        },
    ]);
    //#endregion ---CUSTOMER---

    //#region ---ADMIN---
    await models.Admin.bulkCreate([
        {
            username: "admin",
            password: await bcrypt.hash("testTest1", 10),
            email: "example@example.com",
            emailConfirmed: true,
            registrationToken: "regtoken12345!",
            resetPasswordToken: "restoken12345",
            adminStatus: "Active",
        },
    ]);
    //#endregion ---ADMIN---

    //#region ---RESTRICTION---
    await models.Restriction.bulkCreate([
        {
            weekday: "Monday",
            date: null,
            startTime: "09:00",
            endTime: "20:00",
            restrictionType: "Business_hours",
        },
        {
            weekday: "Tuesday",
            date: null,
            startTime: "09:00",
            endTime: "20:00",
            restrictionType: "Business_hours",
        },
        {
            weekday: "Wednesday",
            date: null,
            startTime: "09:00",
            endTime: "20:00",
            restrictionType: "Business_hours",
        },
        {
            weekday: "Thursday",
            date: null,
            startTime: "09:00",
            endTime: "20:00",
            restrictionType: "Business_hours",
        },
        {
            weekday: "Friday",
            date: null,
            startTime: "09:00",
            endTime: "20:00",
            restrictionType: "Business_hours",
        },
        {
            weekday: "Saturday",
            date: null,
            startTime: "09:00",
            endTime: "20:00",
            restrictionType: "Business_hours",
        },
        {
            weekday: "Sunday",
            date: null,
            startTime: null,
            endTime: null,
            restrictionType: "Business_hours",
        },
        {
            weekday: "Monday",
            date: null,
            startTime: "13:00",
            endTime: "14:00",
            restrictionType: "General_partial_business_closed",
        },
        {
            weekday: "Tuesday",
            date: null,
            startTime: "13:00",
            endTime: "14:00",
            restrictionType: "General_partial_business_closed",
        },
        {
            weekday: "Wednesday",
            date: null,
            startTime: "13:00",
            endTime: "14:00",
            restrictionType: "General_partial_business_closed",
        },
        {
            weekday: "Thursday",
            date: null,
            startTime: "13:00",
            endTime: "14:00",
            restrictionType: "General_partial_business_closed",
        },
        {
            weekday: "Friday",
            date: null,
            startTime: "13:00",
            endTime: "14:00",
            restrictionType: "General_partial_business_closed",
        },
        {
            weekday: "Saturday",
            date: null,
            startTime: "13:00",
            endTime: "14:00",
            restrictionType: "General_partial_business_closed",
        },
        {
            weekday: null,
            date: new Date(Date.UTC(2022, 11, 1)),
            startTime: null,
            endTime: null,
            restrictionType: "Whole_day_business_closed",
        },
        {
            weekday: null,
            date: new Date(Date.UTC(2022, 11, 3)),
            startTime: "16:00",
            endTime: "18:00",
            restrictionType: "Oneoff_partial_business_closed",
        },
    ]);
    //#endregion ---RESTRICTION---

    //#region ---RESERVATION---
    await models.Reservation.bulkCreate([
        {
            date: new Date(Date.UTC(2022, 20, 5, 9, 0, 0)),
            note: "I hope it will be perfect.",
            serviceId: 1,
            reservationStatus: "Active",
            customer: 1,
            reservationToken: "1234567",
            validityEnd: new Date(Date.UTC(2022, 20, 5, 9, 0, 0)),
            customerId: 1,
        },
        {
            date: new Date(Date.UTC(2022, 18, 6, 11, 0, 0)),
            note: null,
            serviceId: 2,
            reservationStatus: "Active",
            customer: 2,
            reservationToken: "12345678",
            validityEnd: new Date(Date.UTC(2022, 18, 6, 11, 0, 0)),
            customerId: 2,
        },
    ]);
    //#endregion ---RESERVATION---
};
