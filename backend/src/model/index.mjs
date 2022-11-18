import db from "./../config/db";
import { Sequelize } from "sequelize";
import getModelAdmin from "./admin";
import getModelReservation from "./reservation";
import getModelRestriction from "./restriction";
import getModelService from "./service";
import getModelStatus from "./status";
import getModelType from "./type";
import getModelUser from "./user";

const models = {
    Admin: getModelAdmin(db, Sequelize),
    Reservation: getModelReservation(db, Sequelize),
    Restriction: getModelRestriction(db, Sequelize),
    Service: getModelService(db, Sequelize),
    Status: getModelStatus(db, Sequelize),
    Type: getModelType(db, Sequelize),
    User: getModelUser(db, Sequelize),
};

Object.keys(models).forEach((key) => {
    if ("associate" in models[key]) {
        models[key].associate(models);
    }
});

export default models;
