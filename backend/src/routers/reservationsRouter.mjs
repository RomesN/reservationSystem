import { Router } from "express";
import { ReservationsController } from "../controllers/index.mjs";

const router = Router();

router.get("/available-days/:serviceId", ReservationsController.getAvailableDays);

export default router;