import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsArray,
  ArrayMinSize,
  IsOptional,
} from "class-validator";

class BaseCompanyAuthDto {
  @ApiProperty({
    example: "TechBridge Solutions",
  })
  @IsString()
  companyName: string;

  @ApiProperty({
    example: "12345678",
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      "Password must be alphanumeric and at least 8 characters long (include letters and numbers)",
  })
  password: string;
}

export class SignInCompanyDto extends BaseCompanyAuthDto {}

export class SignUpCompanyDto extends BaseCompanyAuthDto {
  @ApiProperty({
    example: "company@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: ["Backend", "AI"],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  Fields: string[];

  /*
  @ApiProperty({
    example: "We specialize in backend systems",
  })
  @IsString()
  description: string;
*/
  @ApiProperty({
    type: "string",
    format: "binary",
    required: false,
  })
  logoFile?: any;
}
