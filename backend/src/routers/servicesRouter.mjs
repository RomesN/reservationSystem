import { Router } from "express";
import ServicesController from "../controllers/servicesController.mjs";

const router = Router();

router.get("/", ServicesController.getAllServices);

export default router;
