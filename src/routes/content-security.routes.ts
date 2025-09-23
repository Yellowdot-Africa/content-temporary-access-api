import { Router } from "express";
import { validationMiddleware } from "../middlewares/validation-middleware";

import { ContentSecurityDto, ContentSecurityQueryDto } from "../dtos/content-security.entity.dto";
import { contentSecurityController } from "../controllers/content-security.controller";

const router = Router();


router.post(
  "/",
  validationMiddleware(ContentSecurityDto, "body"),
  (req, res) => contentSecurityController.createContentSecurity(req, res)
);

router.get("/", (req, res) => contentSecurityController.getContentSecurity(req, res));

router.get(
  "/filter",
  validationMiddleware(ContentSecurityQueryDto, "query"),
  (req, res) => contentSecurityController.filterContentSecurity(req, res)
);

export default router;
