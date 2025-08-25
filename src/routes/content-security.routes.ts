import { Router } from "express";
import {
  createContentSecurity,
  getContentSecurity as getContentSecurities ,
  getContentSecurityByMsisdn,
} from "../controllers/content-security.controller";
import { validationMiddleware } from "../middlewares/validation-middleware";

import { ContentSecurityDto, ContentSecurityParamDto } from "../dtos/content-security.entity.dto";

const router = Router();

router.post(
  "/",
  validationMiddleware(ContentSecurityDto, "body"),  // validate req.body for POST
  createContentSecurity
);

router.get("/", getContentSecurities );

router.get(
  "/msisdn/:msisdn",
  validationMiddleware(ContentSecurityParamDto, "params"),  // validate req.params for msisdn
  getContentSecurityByMsisdn
);

export default router;
