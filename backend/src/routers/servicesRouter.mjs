import { Router } from "express";
import ServicesController from "../controllers/servicesController.mjs";

const router = Router();

router.get("/", ServicesController.getAllServices);
router.get("/available-days/:serviceId", ServicesController.getAvailableDays);

export default router;
