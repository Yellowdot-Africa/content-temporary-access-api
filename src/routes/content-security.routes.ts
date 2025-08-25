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
  validationMiddleware(ContentSecurityDto, "body"),
  createContentSecurity
);

router.get("/", getContentSecurities);

router.get(
  "/filter",
  validationMiddleware(ContentSecurityQueryDto, "query"),
  filterContentSecurity
);


export default router;
