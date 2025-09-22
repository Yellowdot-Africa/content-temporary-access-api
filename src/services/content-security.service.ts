import { ContentSecurityDto } from "../dtos/content-security.entity.dto";
import { ContentSecurityResponse, ContentSecurityUpsertResponse } from "../types/content-security-response";
import { contentSecurityRepository } from "../repositories/content-security.repository";
import { createLogger } from "../utils/logger";

const logger = createLogger("ContentSecurityService");

export class ContentSecurityService {

  private toResponse(record: { msisdn: string; service_id: string; expires_at: Date | null }): ContentSecurityResponse {
    return {
      msisdn: record.msisdn,
      service_id: record.service_id,
      expires_at: record.expires_at,
    };
  }

  async upsert(data: ContentSecurityDto): Promise<ContentSecurityUpsertResponse> {
    try {
      logger.info("Upserting Content Security", { msisdn: data.msisdn, service_id: data.service_id });

      const { contentSecurity, message } = await contentSecurityRepository.upsertContentSecurity(data);

      logger.info("Upsert result", {
        msisdn: contentSecurity.msisdn,
        service_id: contentSecurity.service_id,
        expires_at: contentSecurity.expires_at,
        message,
      });

      return { message, ...this.toResponse(contentSecurity) };
    } catch (error) {
      logger.error("Error upserting Content Security", {
        msisdn: data.msisdn,
        service_id: data.service_id,
        error: (error as Error).message,
      });
      throw error;
    }
  }

  async list(): Promise<ContentSecurityResponse[]> {
    try {
      logger.info("Fetching all Content Security records");

      const records = await contentSecurityRepository.getAllContentSecurity();

      logger.info("Content Security records fetched", { count: records.length });

      return records.map(this.toResponse);
    } catch (error) {
      logger.error("Error listing Content Security records", { error: (error as Error).message });
      throw error;
    }
  }

  async filter(msisdn?: string, service_id?: string): Promise<ContentSecurityResponse[]> {

    if (!msisdn && !service_id) {
      throw new Error("At least one of msisdn or service_id must be provided.");
    }

    try {
      logger.info("Filtering Content Security", { msisdn, service_id });

      const results = await contentSecurityRepository.filterContentSecurity(msisdn, service_id);

      if (!results.length) {
        logger.warn("No Content Security records found", { msisdn, service_id });
      } else {
        logger.info("Filtered Content Security results found", { count: results.length, msisdn, service_id });
      }

      return results.map(this.toResponse);
    } catch (error) {
      logger.error("Error filtering Content Security", {
        msisdn,
        service_id,
        error: (error as Error).message,
      });
      throw error;
    }
  }
}

export const contentSecurityService = new ContentSecurityService();
