import { Router } from "express";
import { healthController } from "../controllers/health.controller";

const router = Router();

router.get("/", healthController.getHealthStatus);

export default router;
