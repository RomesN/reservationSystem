import { Router } from "express";
import { AdminController } from "../controllers/index.mjs";

const router = new Router();

router.get("/logout", AdminController.logout.bind(AdminController));

router.get("/reservations/:year/:month", AdminController.getMonthReservations.bind(AdminController));

router.delete("/reservations/:token", AdminController.deleteReservation.bind(AdminController));

router.delete("/reservations/:year/:month/:day", AdminController.deleteAllReservationsOnGivenDay.bind(AdminController));

export default router;
