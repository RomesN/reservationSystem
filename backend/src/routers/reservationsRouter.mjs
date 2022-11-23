import { Router } from "express";
import { ReservationsController } from "../controllers/index.mjs";

const router = new Router();

router.get("/available-days/:serviceId", ReservationsController.getAvailableDays.bind(ReservationsController));

export default router;
