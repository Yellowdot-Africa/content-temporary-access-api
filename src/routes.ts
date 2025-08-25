import { Router } from "express";                
import contentSecurityRoutes from "./routes/content-security.routes";

const router = Router();

router.use("/content-security", contentSecurityRoutes);

export default router;
