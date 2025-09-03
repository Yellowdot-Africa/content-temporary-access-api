import { Router } from "express";
import { ContentSecurityController } from "../controllers/content-security.controller";
import { validationMiddleware } from "../middlewares/validation-middleware";

import { ContentSecurityDto, ContentSecurityQueryDto } from "../dtos/content-security.entity.dto";

const router = Router();
const controller = new ContentSecurityController();

router.post(
  "/",
  validationMiddleware(ContentSecurityDto, "body"),
  (req, res) => controller.createContentSecurity(req, res)
);

router.get("/", (req, res) => controller.getContentSecurity(req, res));

router.get(
  "/filter",
  validationMiddleware(ContentSecurityQueryDto, "query"),
  (req, res) => controller.filterContentSecurity(req, res)
);

export default router;
