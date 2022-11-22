import { Router } from "express";
import { ServicesController } from "../controllers/index.mjs";

const router = Router();

router.get("/", ServicesController.getAllServices);

export default router;
