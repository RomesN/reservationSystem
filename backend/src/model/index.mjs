import { Sequelize } from "sequelize";
import db from "./../config/db.mjs";
import getModelAdmin from "./admin.mjs";
import getModelCustomer from "./customer.mjs";
import getModelReservation from "./reservation.mjs";
import getModelRestriction from "./restriction.mjs";
import getModelService from "./service.mjs";
import getModelStatus from "./status.mjs";
import getModelType from "./type.mjs";

const models = {
    Admin: getModelAdmin(db, Sequelize),
    Reservation: getModelReservation(db, Sequelize),
    Restriction: getModelRestriction(db, Sequelize),
    Service: getModelService(db, Sequelize),
    Status: getModelStatus(db, Sequelize),
    Type: getModelType(db, Sequelize),
    Customer: getModelCustomer(db, Sequelize),
};

Object.keys(models).forEach((key) => {
    if ("associate" in models[key]) {
        models[key].associate(models);
    }
});

export default models;
