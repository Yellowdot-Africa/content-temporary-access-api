import { IsString, IsNotEmpty, IsOptional, Matches, IsEnum } from 'class-validator';
import { ServiceId } from '../types/content-security-response';

export class ContentSecurityDto {

  @IsString()
  @IsNotEmpty()
  @Matches(/^27\d{9}$/, {
    message: "MSISDN must start with '27' and be exactly 11 digits long",
  })
  msisdn!: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ServiceId, {
    message: "service_id must be either 'mtn_sa' or 'vodacom_sa' or 'cell_sa' or 'telkom_sa'",
  })
  service_id!: string;

  @IsString()
  @IsNotEmpty()
  ctx!: string;

  @IsString()
  @IsNotEmpty()
  ext_ref!: string;

  @IsString()
  @IsNotEmpty()
  transaction_id!: string;

  @IsString()
  @IsNotEmpty()
  source!: string;

  @IsString()
  @IsNotEmpty()
  mno!: string;

}


export class ContentSecurityQueryDto {

  @IsString()
  @IsOptional()
  @Matches(/^27\d{9}$/, {
    message: "MSISDN must start with '27' and be exactly 11 digits long",
  })
  msisdn?: string;

  @IsString()
  @IsOptional()
  @IsEnum(ServiceId, {
    message: "service_id must be either 'mtn_sa' or 'vodacom_sa' or 'cell_sa' or 'telkom_sa'",
  })
  service_id?: string;

}


