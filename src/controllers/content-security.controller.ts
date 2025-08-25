import { Request, Response } from "express";
import * as service from "../services/content-security.service";
import { ContentSecurityDto, ContentSecurityParamDto } from "../dtos/content-security.entity.dto";

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
    console.log(`Fetched ${installs.length} installations`);
    
    res.json(installs);
  } catch (err) {
    console.error("Error fetching Content Securitys:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getContentSecurityByMsisdn = async (req: Request, res: Response) => {
  try {
    const dto = (req as any).validatedData as ContentSecurityParamDto;
    console.log(`Fetching Content Security by msisdn: ${dto.msisdn}`);
    
    const install = await service.getContentSecurityByMsisdn(dto.msisdn);
    if (!install) {
      console.warn(`Content Security not found for msisdn: ${dto.msisdn}`);
      return res.status(404).json({ error: "Installation not found" });
    }
    
    console.log("Content Security found:", install);
    res.json(install);
  } catch (err) {
    console.error("Error fetching Content Security by msisdn:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};
