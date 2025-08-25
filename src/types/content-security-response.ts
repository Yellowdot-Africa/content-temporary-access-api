export interface ContentSecurityResponse {
    msisdn: string;
    service_id: string;
    expires_at: Date;
    message?: string; // ✅ optional now
};