import "dotenv/config";
import models from "../models";
import enums from "../models/enums";

export default async () => {
    //#region ---ENUMS INIT---

    // statuses
    let create = [];
    Object.values(enums.status).forEach((userStatus) => create.push({ status: userStatus }));
    await models.Status.bulkCreate(create);

    // type
    create.length = 0;
    Object.values(enums.restrictionType).forEach((restrictionType) => create.push({ type: restrictionType }));
    await models.Status.bulkCreate(create);

    //#region ---SERVICES---
    //#endregion
};
