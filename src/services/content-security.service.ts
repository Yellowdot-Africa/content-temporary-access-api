import { AppDataSource } from "../config/db"; // adjust path as needed
import { ContentSecurityDto } from "../dtos/content-security.entity.dto";
import { ContentSecurity } from "../models/content-security.entity";

const repo = AppDataSource.getRepository(ContentSecurity);

export const upsertContentSecurity = async (data: ContentSecurityDto) => {
  const now = new Date();
  try {
    console.log(`Upserting Content security for msisdn: ${data.msisdn}`);

    const existing = await repo.findOne({ where: { msisdn: data.msisdn } });

    if (existing) {
      // --- Update existing record ---

      const entity = repo.merge(existing, {
        ...data,
        updated_at: now,
      });

      const saved = await repo.save(entity);
      console.log(
        `Updated Content security record for msisdn: ${data.msisdn}`
      );
      return saved;
    }


    const entity = repo.create({
      ...data,
      created_at: now,
      updated_at: now,
    });

    const saved = await repo.save(entity);
    console.log(
      `Created Content security record for msisdn: ${data.msisdn}`
    );
    return saved;
  } catch (error) {
    console.error(`Error upserting Content security for msisdn: ${data.msisdn}`, error);
    throw error;
  }
};

export const listContentSecurities = async () => {
  console.log("Listing Content securities");
  const installs = await repo.find();
  console.log(`Content security Found ${installs.length}`);
  return installs;
};

export const filterContentSecurity = async (msisdn?: string, service_id?: string) => {
  console.log(`Filtering Content Security with msisdn: ${msisdn}, service_id: ${service_id}`);

  const whereClause: any = {};
  if (msisdn) whereClause.msisdn = msisdn;
  if (service_id) whereClause.service_id = service_id;

  const results = await repo.find({ where: whereClause });

  if (!results || results.length === 0) {
    console.warn(`No Content Security records found for msisdn: ${msisdn}, service_id: ${service_id}`);
  }

  return results;
};

