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
    "/temporary-reservation/:isoTimeString/:serviceId",
    ReservationsController.createNewTemporaryReservation.bind(ReservationsController)
);

router.put(
    "/final-reservation/:reservationToken",
    ReservationsController.createFinalReservation.bind(ReservationsController)
);

router.delete(
    "/temporary-reservation/:reservationToken",
    ReservationsController.deleteTemporaryReservation.bind(ReservationsController)
);

router.delete(
    "/final-reservation/:reservationToken",
    ReservationsController.deleteFinalReservation.bind(ReservationsController)
);

export default router;
