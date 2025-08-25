import { AppDataSource } from "../config/db";
import { Repository } from "typeorm";
import { ContentSecurity } from "../models/content-security.entity";
import { ContentSecurityDto } from "../dtos/content-security.entity.dto";

export class ContentSecurityRepository {
  private repo: Repository<ContentSecurity>;

  constructor() {
    this.repo = AppDataSource.getRepository(ContentSecurity);
  }

  async createContentSecurity(data: ContentSecurityDto): Promise<ContentSecurity> {
    const user = this.repo.create(data);
    return await this.repo.save(user);
  }

  async getAllContentSecurity(): Promise<ContentSecurity[]> {
    return await this.repo.find();
  }

  async findById(id: number): Promise<ContentSecurity | null> {
    return await this.repo.findOneBy({ id });
  }
}
