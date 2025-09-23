import { Router } from "express";                
import contentSecurityRoutes from "./routes/content-security.routes";
import HealthRoutes from "./routes/health-routes";

const router = Router();

router.use("/content-security", contentSecurityRoutes);
router.use("/health", HealthRoutes);

export default router;
