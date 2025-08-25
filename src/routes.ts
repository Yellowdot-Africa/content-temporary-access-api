import { Router } from "express";                
import contentSecurityRoutes from "./routes/content-security.routes";

const router = Router();

router.use("/ContentSecurity", contentSecurityRoutes);

export default router;
