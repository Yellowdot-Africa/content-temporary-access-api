import { Request, Response } from "express";
import * as service from "../services/content-security.service";
import { ContentSecurityDto, ContentSecurityQueryDto } from "../dtos/content-security.entity.dto";

export const createContentSecurity = async (req: Request, res: Response) => {
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
};

export const getContentSecurity = async (_req: Request, res: Response) => {
  try {
    console.log("Fetching all Content Securitys");
    
    const installs = await service.listContentSecurities();
    console.log(`Fetched ${installs.length} Content Securities`);
    
    res.json(installs);
  } catch (err) {
    console.error("Error fetching Content Securitys:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

export const filterContentSecurity = async (req: Request, res: Response) => {
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
};

