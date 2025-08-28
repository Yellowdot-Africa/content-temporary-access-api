import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class ContentSecurityDto {

  @IsString()
  @IsNotEmpty()
  @Matches(/^27\d{9}$/, {
    message: "MSISDN must start with '27' and be exactly 11 digits long",
  })
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


export class ContentSecurityQueryDto {

  @IsString()
  @IsOptional()
  @Matches(/^27\d{9}$/, {
    message: "MSISDN must start with '27' and be exactly 11 digits long",
  })
  msisdn?: string;

  @IsString()
  @IsOptional()
  service_id?: string;

}


