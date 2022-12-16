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
    "/temporal-reservation/:isoTimeString/:serviceId",
    ReservationsController.createNewTemporalReservation.bind(ReservationsController)
);

router.put(
    "/final-reservation/:reservationToken",
    ReservationsController.createFinalReservation.bind(ReservationsController)
);

router.delete(
    "/temporal-reservation/:reservationToken",
    ReservationsController.deleteTemporalReservation.bind(ReservationsController)
);

export default router;
