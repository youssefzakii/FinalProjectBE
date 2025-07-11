import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  Fields?: string[];

  @IsOptional()
  @IsString()
  logo?: string;
} 