import { createLogger, logger } from "../utils/logger";
import { Request, Response } from "express";
import { contentSecurityService } from '../services/content-security.service'
import { ContentSecurityDto, ContentSecurityQueryDto } from "../dtos/content-security.entity.dto";
const log = createLogger("ContentSecurityController");

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
  async createContentSecurity(req: Request, res: Response): Promise<void> {
    log.info(`START createContentSecurity`);

    try {
      const dto = (req as any).validatedData as ContentSecurityDto;

      log.info(`Payload: ${JSON.stringify(dto)}`);

      const upsert = await contentSecurityService.upsert(dto);
      log.info(`SUCCESS: Content Security upserted - msisdn: ${upsert.msisdn}, service_id: ${dto.service_id}`);
      res.status(201).json(upsert);

    } catch (err) {
      log.error('ERROR: Failed to create Content Security', err);
      res.status(500).json({ error: (err as Error).message });
    } finally {
      log.info(`END createContentSecurity`);
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
  async getContentSecurity(_req: Request, res: Response): Promise<void> {
    log.info(`START getContentSecurity`);

    try {
      const installs = await contentSecurityService.list();
      log.info(`SUCCESS: Retrieved ${installs.length} Content Security records`);
      res.json(installs);

    } catch (err) {
      log.error('ERROR: Failed to fetch Content Security records', err);
      res.status(500).json({ error: (err as Error).message });
    } finally {
      log.info(`END getContentSecurity`);
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
  async filterContentSecurity(req: Request, res: Response): Promise<void> {
    log.info(`START filterContentSecurity`);

    try {
      const dto = (req as any).validatedData as ContentSecurityQueryDto;
      log.info(`Filter params - msisdn: ${dto.msisdn ?? "N/A"}, service_id: ${dto.service_id ?? "N/A"}`);

      const results = await contentSecurityService.filter(dto.msisdn, dto.service_id);

      if (!results || results.length === 0) {
        log.warn(`No records found for msisdn: ${dto.msisdn ?? "N/A"}, service_id: ${dto.service_id ?? "N/A"}`);
        res.status(404).json({ error: "No records found" });
        return;
      }

      log.info(`SUCCESS: Found ${results.length} matching Content Security records`);
      res.json(results);

    } catch (err) {
      log.error('ERROR: Failed to filter Content Security', err);
      res.status(500).json({ error: (err as Error).message });
    } finally {
      log.info(`END filterContentSecurity`);
    }
  }
}
