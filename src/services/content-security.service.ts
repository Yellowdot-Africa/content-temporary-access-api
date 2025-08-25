import { AppDataSource } from "../config/db";
import { ContentSecurityDto } from "../dtos/content-security.entity.dto";
import { ContentSecurity } from "../models/content-security.entity";
import { ContentSecurityResponse } from "../types/content-security-response";

const repo = AppDataSource.getRepository(ContentSecurity);

// Configurable expiry (default: 24 hours)
const ACCESS_DURATION_HOURS = Number(process.env.ACCESS_DURATION_HOURS || 24);
const ACCESS_DURATION_MS = ACCESS_DURATION_HOURS * 60 * 60 * 1000;

export const upsertContentSecurity = async (data: ContentSecurityDto): Promise<ContentSecurityResponse> => {
  const now = new Date();
  const expiry = new Date(now.getTime() + ACCESS_DURATION_MS);

  try {
    console.log(`Upserting Content Security for msisdn: ${data.msisdn}`);

    const existing = await repo.findOne({ where: { msisdn: data.msisdn } });

    if (existing) {
      // ✅ Already has access that’s still valid
      if (existing.expires_at && existing.expires_at > now) {
        console.log(
          `Access already granted for msisdn: ${data.msisdn} until ${existing.expires_at}`
        );
        return {
          message: "Access already granted for 24 hours",
          msisdn: existing.msisdn,
          service_id: existing.service_id,
          expires_at: existing.expires_at,
        };
      }

      // ✅ Expired → update access
      const entity = repo.merge(existing, {
        ...data,
        expires_at: expiry,
        updated_at: now,
      });
      const saved = await repo.save(entity);

      console.log(`Updated Content Security for msisdn: ${data.msisdn}`);
      return {
        message: "Access updated for next 24 hours",
        msisdn: saved.msisdn,
        service_id: saved.service_id,
        expires_at: saved.expires_at,
      };
    }

    // ✅ No record → create new
    const entity = repo.create({
      ...data,
      expires_at: expiry,
      created_at: now,
      updated_at: now,
    });
    const saved = await repo.save(entity);

    console.log(`Created Content Security for msisdn: ${data.msisdn}`);
    return {
      message: "New access granted for 24 hours",
      msisdn: saved.msisdn,
      service_id: saved.service_id,
      expires_at: saved.expires_at,
    };
  } catch (error) {
    console.error(
      `Error upserting Content Security for msisdn: ${data.msisdn}`,
      error
    );
    throw error;
  }
};

export const listContentSecurities = async (): Promise<ContentSecurityResponse[]> => {
  console.log("Listing Content Securities");
  const records = await repo.find();
  console.log(`Found ${records.length} records`);

  return records.map((r) => ({
    msisdn: r.msisdn,
    service_id: r.service_id,
    expires_at: r.expires_at,
  }));
};

export const filterContentSecurity = async (msisdn?: string, service_id?: string): Promise<ContentSecurityResponse[]> => {
  if (!msisdn && !service_id) {
    throw new Error("At least one of msisdn or service_id must be provided.");
  }

  console.log(
    `Filtering Content Security with msisdn: ${msisdn}, service_id: ${service_id}`
  );

  const whereClause: Partial<ContentSecurity> = {
    ...(msisdn && { msisdn }),
    ...(service_id && { service_id }),
  };

  const results = await repo.find({ where: whereClause });

  if (!results.length) {
    console.warn(
      `No records found for msisdn: ${msisdn}, service_id: ${service_id}`
    );
  }

  return results.map((r) => ({
    msisdn: r.msisdn,
    service_id: r.service_id,
    expires_at: r.expires_at,
  }));
};
