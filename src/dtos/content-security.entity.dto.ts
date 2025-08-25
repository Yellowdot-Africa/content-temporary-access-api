import { IsString, IsNotEmpty } from 'class-validator';

export class ContentSecurityDto {

  @IsString()
  @IsNotEmpty()
  msisdn!: string;

  @IsString()
  @IsNotEmpty()
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


export class ContentSecurityParamDto {

  @IsString()
  @IsNotEmpty()
  msisdn!: string;

}


