import { Router } from "express";
import {
  createContentSecurity,
  filterContentSecurity,
  getContentSecurity as getContentSecurities,
} from "../controllers/content-security.controller";
import { validationMiddleware } from "../middlewares/validation-middleware";

import { ContentSecurityDto, ContentSecurityQueryDto } from "../dtos/content-security.entity.dto";

const router = Router();

router.post(
  "/",
  validationMiddleware(ContentSecurityDto, "body"),  // validate req.body for POST
  createContentSecurity
);

router.get("/", getContentSecurities);

router.get(
  "/content-security/filter",
  validationMiddleware(ContentSecurityQueryDto, "query"),  // ✅ validate optional query params: msisdn & service_id
  filterContentSecurity  // ✅ renamed handler to reflect filtering logic
);



export default router;
