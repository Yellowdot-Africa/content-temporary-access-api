import { AppDataSource } from "../config/db";
import { ContentSecurityDto } from "../dtos/content-security.entity.dto";
import { ContentSecurity } from "../models/content-security.entity";
import { ContentSecurityResponse } from "../types/content-security-response";
import { logger } from "../utils/logger";

const repo = AppDataSource.getRepository(ContentSecurity);

// Configurable expiry (default: 24 hours)
const ACCESS_DURATION_HOURS = Number(process.env.ACCESS_DURATION_HOURS || 24);
const ACCESS_DURATION_MS = ACCESS_DURATION_HOURS * 60 * 60 * 1000;

export const upsertContentSecurity = async (data: ContentSecurityDto): Promise<ContentSecurityResponse> => {
  const now = new Date();
  const expiry = new Date(now.getTime() + ACCESS_DURATION_MS);

  try {
    logger.info("Upserting Content Security", {
      msisdn: data.msisdn,
      service_id: data.service_id,
    });

    const existing = await repo.findOne({
      where: { msisdn: data.msisdn, service_id: data.service_id },
    });

    if (existing) {
      // Already has valid access
      if (existing.expires_at && existing.expires_at > now) {
        logger.info("Access already valid", {
          msisdn: existing.msisdn,
          service_id: existing.service_id,
          expires_at: existing.expires_at,
        });

        return {
          message: "Access already granted for 24 hours",
          msisdn: existing.msisdn,
          service_id: existing.service_id,
          expires_at: existing.expires_at,
        };
      }

      // Expired → update access
      const entity = repo.merge(existing, {
        ...data,
        expires_at: expiry,
        updated_at: now,
      });
      const saved = await repo.save(entity);

      logger.info("Updated expired access", {
        msisdn: saved.msisdn,
        service_id: saved.service_id,
        expires_at: saved.expires_at,
      });

      return {
        message: "Access updated for next 24 hours",
        msisdn: saved.msisdn,
        service_id: saved.service_id,
        expires_at: saved.expires_at,
      };
    }

    // New record
    const entity = repo.create({
      ...data,
      expires_at: expiry,
      created_at: now,
      updated_at: now,
    });
    const saved = await repo.save(entity);

    logger.info("Created new Content Security record", {
      msisdn: saved.msisdn,
      service_id: saved.service_id,
      expires_at: saved.expires_at,
    });

    return {
      message: "New access granted for 24 hours",
      msisdn: saved.msisdn,
      service_id: saved.service_id,
      expires_at: saved.expires_at,
    };
  } catch (error) {
    logger.error("Error upserting Content Security", {
      msisdn: data.msisdn,
      service_id: data.service_id,
      error: (error as Error).message,
    });
    throw error;
  }
};

export const listContentSecurities = async (): Promise<ContentSecurityResponse[]> => {
  try {
    logger.info("Fetching all Content Security records");

    const records = await repo.find();

    logger.info("Content Security records fetched", {
      count: records.length,
    });

    return records.map((r) => ({
      msisdn: r.msisdn,
      service_id: r.service_id,
      expires_at: r.expires_at,
    }));
  } catch (error) {
    logger.error("Error listing Content Security records", {
      error: (error as Error).message,
    });
    throw error;
  }
};

export const filterContentSecurity = async (
  msisdn?: string,
  service_id?: string
): Promise<ContentSecurityResponse[]> => {
  try {
    if (!msisdn && !service_id) {
      throw new Error("At least one of msisdn or service_id must be provided.");
    }

    logger.info("Filtering Content Security", {
      msisdn,
      service_id,
    });

    const whereClause: Partial<ContentSecurity> = {
      ...(msisdn && { msisdn }),
      ...(service_id && { service_id }),
    };

    const results = await repo.find({ where: whereClause });

    if (!results.length) {
      logger.warn("No Content Security records found", { msisdn, service_id });
    } else {
      logger.info("Filtered Content Security results found", {
        count: results.length,
        msisdn,
        service_id,
      });
    }

    return results.map((r) => ({
      msisdn: r.msisdn,
      service_id: r.service_id,
      expires_at: r.expires_at,
    }));
  } catch (error) {
    logger.error("Error filtering Content Security", {
      msisdn,
      service_id,
      error: (error as Error).message,
    });
    throw error;
  }
};
