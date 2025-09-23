import { Request, Response } from "express";

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     tags:
 *       - health
 *     summary: Health check endpoint
 *     description: Returns the current status of the API
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: '2025-09-16T12:34:56.000Z'
 *                 message:
 *                   type: string
 *                   example: API is healthy and running 🚀
 */
class HealthController {
  async getHealthStatus(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      message: "API is healthy and running 🚀",
    });
  }
}

export const healthController = new HealthController();