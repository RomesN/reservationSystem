import { Router } from "express";
import { ServicesController } from "../controllers/index.mjs";

const router = new Router();

router.get("/", ServicesController.getAllServices);

export default router;
