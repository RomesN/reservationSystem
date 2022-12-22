import { Router } from "express";
import { AdminController } from "../controllers/index.mjs";

const router = new Router();

router.post("/login", AdminController.login.bind(AdminController));

export default router;
