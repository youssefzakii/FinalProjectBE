import { IsOptional, IsString, IsBoolean, IsArray } from 'class-validator';

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  approved?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];
} 