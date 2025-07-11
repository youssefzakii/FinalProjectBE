import { IsOptional, IsString, IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false, description: 'Username of the user' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ required: false, description: 'Email of the user' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false, description: 'Password of the user' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ required: false, enum: ['user', 'admin'], description: 'Role of the user' })
  @IsOptional()
  @IsEnum(['user', 'admin'])
  role?: string;

  @ApiProperty({ required: false, type: [String], description: 'Fields/skills of the user' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  Fields?: string[];

  @ApiProperty({ required: false, description: 'Avatar URL of the user' })
  @IsOptional()
  @IsString()
  avatar?: string;
} 