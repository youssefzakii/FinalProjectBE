import { IsOptional, IsString, IsArray, IsObject } from 'class-validator';

export class UpdateCvScoreDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  cvText?: string;

  @IsOptional()
  @IsString()
  jobDescription?: string;

  @IsOptional()
  @IsArray()
  jobSection?: any[];

  @IsOptional()
  @IsObject()
  scoreResult?: any;

  @IsOptional()
  @IsString()
  cvFileUrl?: string;
} 