// content-security-response.ts
export interface ContentSecurityResponse {
    msisdn: string;
    service_id: string;
    expires_at: Date | null;  // <-- allow null here
}

export interface ContentSecurityUpsertResponse extends ContentSecurityResponse {
  message: string;
}


export enum Mnos {
    MTN_SA = "mtn_sa",
    CELL_SA = "cell_sa",
    VODACOM_SA = "vodacom_sa",
    TELKOM_SA = "telkom_sa"
}
