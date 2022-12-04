import { Router } from "express";
import { ReservationsController } from "../controllers/index.mjs";

const router = new Router();

router.get(
    "/available-days/:serviceId/:year/:month",
    ReservationsController.getAvailableDays.bind(ReservationsController)
);

router.get(
    "/is-available/:isoTimeString/:serviceId",
    ReservationsController.getAvailabilityInfo.bind(ReservationsController)
);

router.put(
    "/temporal-booking/:isoTimeString/:serviceId",
    ReservationsController.createNewTemporalBooking.bind(ReservationsController)
);

export default router;
