import { add } from "date-fns";
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

    //#region ---ADMIN---
    await models.Admin.bulkCreate([
        {
            username: "admin",
            password: await bcrypt.hash(process.env.ADMIN_INITIAL_DATA_SEED_PASSWORD, 10),
            email: "example@exampl.com",
            emailConfirmed: true,
            registrationToken: "adminTok11",
            resetPasswordToken: "adminTok12",
            adminStatus: "Active",
        },
    ]);
    //#endregion ---ADMIN---

    //#region ---CUSTOMER---
    await models.Customer.bulkCreate([
        {
            firstName: "Test",
            lastName: "User",
            email: "romannemeth1@gmail.com",
            telephoneNumber: "+420123456789",
            scheduledJobId: null,
        },
    ]);
    //#endregion ---CUSTOMER---

    //#region ---RESTRICTION---
    await models.Restriction.bulkCreate([
        {
            weekday: "Monday",
            date: null,
            startTime: "09:00",
            endTime: "20:00",
            restrictionType: enums.restrictionType.BUSINESS_HOURS,
        },
        {
            weekday: "Tuesday",
            date: null,
            startTime: "09:00",
            endTime: "20:00",
            restrictionType: enums.restrictionType.BUSINESS_HOURS,
        },
        {
            weekday: "Wednesday",
            date: null,
            startTime: "09:00",
            endTime: "20:00",
            restrictionType: enums.restrictionType.BUSINESS_HOURS,
        },
        {
            weekday: "Thursday",
            date: null,
            startTime: "09:00",
            endTime: "20:00",
            restrictionType: enums.restrictionType.BUSINESS_HOURS,
        },
        {
            weekday: "Friday",
            date: null,
            startTime: "09:00",
            endTime: "20:00",
            restrictionType: enums.restrictionType.BUSINESS_HOURS,
        },
        {
            weekday: "Saturday",
            date: null,
            startTime: "09:00",
            endTime: "20:00",
            restrictionType: enums.restrictionType.BUSINESS_HOURS,
        },
        {
            weekday: "Sunday",
            date: null,
            startTime: null,
            endTime: null,
            restrictionType: enums.restrictionType.BUSINESS_HOURS,
        },
        {
            weekday: "Monday",
            date: null,
            startTime: "13:00",
            endTime: "14:00",
            restrictionType: enums.restrictionType.REGULAR_BREAK,
        },
        {
            weekday: "Tuesday",
            date: null,
            startTime: "13:00",
            endTime: "14:00",
            restrictionType: enums.restrictionType.REGULAR_BREAK,
        },
        {
            weekday: "Wednesday",
            date: null,
            startTime: "13:00",
            endTime: "14:00",
            restrictionType: enums.restrictionType.REGULAR_BREAK,
        },
        {
            weekday: "Thursday",
            date: null,
            startTime: "13:00",
            endTime: "14:00",
            restrictionType: enums.restrictionType.REGULAR_BREAK,
        },
        {
            weekday: "Friday",
            date: null,
            startTime: "13:00",
            endTime: "14:00",
            restrictionType: enums.restrictionType.REGULAR_BREAK,
        },
        {
            weekday: "Saturday",
            date: null,
            startTime: "13:00",
            endTime: "14:00",
            restrictionType: enums.restrictionType.REGULAR_BREAK,
        },
        {
            weekday: "Sunday",
            date: null,
            startTime: null,
            endTime: null,
            restrictionType: enums.restrictionType.REGULAR_BREAK,
        },
    ]);
    //#endregion ---RESTRICTION---

    //#region ---RESERVATION---
    await models.Reservation.bulkCreate([
        {
            date: add(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 10, 0, 0), {
                days: 3,
            }),
            note: "I hope it will be perfect.",
            serviceId: 1,
            reservationStatus: "Active",
            reservationToken: "1234567",
            validityEnd: add(
                new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 10, 0, 0),
                {
                    days: 3,
                }
            ),
            customerId: 1,
        },
        {
            date: add(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 10, 0, 0), {
                days: 5,
            }),
            note: null,
            serviceId: 2,
            reservationStatus: "Active",
            reservationToken: "12345678",
            validityEnd: add(
                new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 10, 0, 0),
                {
                    days: 3,
                }
            ),
            customerId: 1,
        },
    ]);
    //#endregion ---RESERVATION---
};
