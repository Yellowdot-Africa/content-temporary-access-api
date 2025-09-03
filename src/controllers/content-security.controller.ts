import { Request, Response } from "express";
import * as service from "../services/content-security.service";
import { ContentSecurityDto, ContentSecurityQueryDto } from "../dtos/content-security.entity.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateContentSecurityDto:
 *       type: object
 *       properties:
 *         msisdn:
 *           type: string
 *           example: "27831234567"
 *           pattern: "^27\\d{9}$"
 *           description: "MSISDN must start with '27' and be exactly 11 digits long"
 *         service_id:
 *           type: string
 *           example: "mtnXXX"
 *         ctx:
 *           type: string
 *           example: "user_ctx"
 *         ext_ref:
 *           type: string
 *           example: "external_ref_123"
 *         transaction_id:
 *           type: string
 *           example: "txn_456"
 *         source:
 *           type: string
 *           example: "mobile_app"
 *         mno:
 *           type: string
 *           example: "vodacom_XX"
 *           description: "MNO must be either 'mtn_sa' or 'vodacom_sa' or 'cell_sa' or 'telkom_sa'"
 *       required:
 *         - msisdn
 *         - service_id
 *         - ctx
 *         - ext_ref
 *         - transaction_id
 *         - source
 *         - mno
 * 
 *     ContentSecurityFilterDto:
 *       type: object
 *       properties:
 *         msisdn:
 *           type: string
 *           description: Optional MSISDN to filter results
 *           example: "27831234567"
 *           pattern: "^27\\d{9}$"
 *         service_id:
 *           type: string
 *           description: Optional service ID to filter results
 *           example: "mtn_sa"
 */

export class ContentSecurityController {
  /**
   * @swagger
   * /api/v1/content-security:
   *   post:
   *     tags:
   *       - content-security
   *     summary: Create new Content Security
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateContentSecurityDto'
   *     responses:
   *       201:
   *         description: Created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "New access granted for 24 hours"
   *                 msisdn:
   *                   type: string
   *                   example: "27831234567"
   *                 service_id:
   *                   type: string
   *                   example: "mtnXXX"
   *                 expires_at:
   *                   type: string
   *                   format: date-time
   *                   example: "2025-09-04T12:42:59.989Z"
   *       500:
   *         description: Server error
   */
  async createContentSecurity(req: Request, res: Response) {
    try {
      const dto = (req as any).validatedData as ContentSecurityDto;
      console.log("Creating Content Security with data:", dto);

      const upsert = await service.upsertContentSecurity(dto);
      console.log("Content Security created successfully:", upsert);

      res.status(201).json(upsert);

    } catch (err) {
      console.error("Error creating Content Security:", err);
      res.status(500).json({ error: (err as Error).message });
    }
  }

  /**
   * @swagger
   * /api/v1/content-security:
   *   get:
   *     tags:
   *       - content-security
   *     summary: Get list of Content Securities
   *     responses:
   *       200:
   *         description: OK
   *       500:
   *         description: Server error
   */
  async getContentSecurity(_req: Request, res: Response) {
    try {
      console.log("Fetching all Content Securities");

      const installs = await service.listContentSecurities();
      console.log(`Fetched ${installs.length} Content Securities`);

      res.json(installs);
    } catch (err) {
      console.error("Error fetching Content Securities:", err);
      res.status(500).json({ error: (err as Error).message });
    }
  }

  /**
   * @swagger
   * /api/v1/content-security/filter:
   *   get:
   *     tags:
   *       - content-security
   *     summary: Filter Content Security by optional msisdn and service_id
   *     parameters:
   *       - in: query
   *         name: msisdn
   *         schema:
   *           type: string
   *           pattern: "^27\\d{9}$"
   *         required: false
   *         description: Optional MSISDN to filter results
   *       - in: query
   *         name: service_id
   *         schema:
   *           type: string
   *         required: false
   *         description: Optional service ID to filter results
   *     responses:
   *       200:
   *         description: Filtered results returned
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   msisdn:
   *                     type: string
   *                     example: "27831234567"
   *                   service_id:
   *                     type: string
   *                     example: "mtnXXX"
   *                   expires_at:
   *                     type: string
   *                     format: date-time
   *                     example: "2025-09-04T12:42:59.989Z"
   *       404:
   *         description: No matching records found
   *       500:
   *         description: Server error
   */
  async filterContentSecurity(req: Request, res: Response) {
    try {
      const dto = (req as any).validatedData as ContentSecurityQueryDto;
      console.log(`Filtering Content Security with msisdn: ${dto.msisdn}, service_id: ${dto.service_id}`);

      const results = await service.filterContentSecurity(dto.msisdn, dto.service_id);

      if (!results || results.length === 0) {
        console.warn(`No Content Security records found for msisdn: ${dto.msisdn}, service_id: ${dto.service_id}`);
        return res.status(404).json({ error: "No records found" });
      }

      console.log("Filtered Content Security results:", results);
      res.json(results);
    } catch (err) {
      console.error("Error filtering Content Security:", err);
      res.status(500).json({ error: (err as Error).message });
    }
  }
}
