import { AppDataSource } from "../config/db";
import { FindOptionsWhere, Repository } from "typeorm";
import { ContentSecurity } from "../models/content-security.entity";
import { ContentSecurityDto } from "../dtos/content-security.entity.dto";

class ContentSecurityRepository {
  
  private repo: Repository<ContentSecurity>;
  private readonly ACCESS_DURATION_MS: number;

  constructor() {
    this.repo = AppDataSource.getRepository(ContentSecurity);
    const ACCESS_DURATION_HOURS = Number(process.env.ACCESS_DURATION_HOURS || 24);
    this.ACCESS_DURATION_MS = ACCESS_DURATION_HOURS * 60 * 60 * 1000;
  }

  private getExpiryDate(baseDate = new Date()): Date {
    return new Date(baseDate.getTime() + this.ACCESS_DURATION_MS);
  }

  async createContentSecurity(data: ContentSecurityDto): Promise<ContentSecurity> {
    const now = new Date();
    const entity = this.repo.create({
      ...data,
      expires_at: this.getExpiryDate(now),
      created_at: now,
      updated_at: now,
    });

    return this.repo.save(entity);
  }

  async updateContentSecurity(existing: ContentSecurity, data: ContentSecurityDto): Promise<ContentSecurity> {
    const now = new Date();
    this.repo.merge(existing, {
      ...data,
      expires_at: this.getExpiryDate(now),
      updated_at: now,
    });

    return this.repo.save(existing);
  }

  async upsertContentSecurity(data: ContentSecurityDto): Promise<{ contentSecurity: ContentSecurity; message: string }> {
    const now = new Date();

    const existing = await this.repo.findOne({
      where: { msisdn: data.msisdn, service_id: data.service_id },
    });

    if (existing) {
      if (existing.expires_at && existing.expires_at > now) {
        // Existing access still valid
        return { contentSecurity: existing, message: "Access already granted for 24 hours" };
      } else {
        const updated = await this.updateContentSecurity(existing, data);
        // Access expired and now updated
        return { contentSecurity: updated, message: "Access updated for next 24 hours" };
      }
    }

    // New record created
    const created = await this.createContentSecurity(data);
    return { contentSecurity: created, message: "Access granted for 24 hours" };
  }


  async getAllContentSecurity(): Promise<ContentSecurity[]> {
    return this.repo.find();
  }

  async findById(id: number): Promise<ContentSecurity | null> {
    return this.repo.findOneBy({ id });
  }

  async filterContentSecurity(msisdn?: string, service_id?: string): Promise<ContentSecurity[]> {
    const whereClause: FindOptionsWhere<ContentSecurity> = {};

    if (msisdn) whereClause.msisdn = msisdn;
    if (service_id) whereClause.service_id = service_id;

    return this.repo.find({ where: whereClause });
  }
}

export const contentSecurityRepository = new ContentSecurityRepository();
