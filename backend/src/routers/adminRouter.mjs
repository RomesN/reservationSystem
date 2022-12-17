import { Router } from "express";
import { AdminController } from "../controllers/index.mjs";

const router = new Router();

router.get("/logout", AdminController.logout.bind(AdminController));

router.get("/reservations/:year/:month", AdminController.getMonthReservations.bind(AdminController));

export default router;
