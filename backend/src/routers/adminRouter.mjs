import { Router } from "express";
import { AdminController } from "../controllers/index.mjs";

const router = new Router();

router.put(
    "/restrictions/business-closed/:date",
    AdminController.createBusinessClosedRestriction.bind(AdminController)
);

router.get("/logout", AdminController.logout.bind(AdminController));

router.get("/reservations/:year/:month", AdminController.getMonthReservations.bind(AdminController));

router.get("/restrictions/business-hours", AdminController.getBusinessHours.bind(AdminController));

router.get("/restrictions/regular-brakes", AdminController.getRegularBrakes.bind(AdminController));

router.get(
    "/restrictions/business-closed/:year/:month",
    AdminController.getBusinessClosedForMonth.bind(AdminController)
);

router.patch("/restrictions/business-hours", AdminController.updateBusinessHours.bind(AdminController));

router.patch("/restrictions/regular-brakes", AdminController.updateRegularBrakes.bind(AdminController));

router.delete("/reservations/:token", AdminController.deleteReservation.bind(AdminController));

router.delete("/reservations/:year/:month/:day", AdminController.deleteAllReservationsOnGivenDay.bind(AdminController));

router.delete(
    "/restrictions/business-closed/:id",
    AdminController.deleteBusinessClosedRestrictionById.bind(AdminController)
);

export default router;
