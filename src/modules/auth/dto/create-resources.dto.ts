import { IsOptional, IsString } from 'class-validator';

export class CreateResourceDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  url: string;

  @IsString()
  type: string;

  @IsString()
  username: string;
}
