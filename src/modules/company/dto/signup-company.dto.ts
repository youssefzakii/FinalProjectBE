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
import { Transform } from "class-transformer";

class BaseCompanyAuthDto {
  @ApiProperty({
    example: "objects",
  })
  @IsString()
  companyName: string;

  @ApiProperty({
    example: "pass1234",
  })
  @IsString()
  @MinLength(8, {
    message: "Password must be at least 8 characters long",
  })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      "Password must be alphanumeric and include at least one letter and one number",
  })
  password: string;
}

export class SignInCompanyDto extends BaseCompanyAuthDto {}

export class SignUpCompanyDto extends BaseCompanyAuthDto {
  @ApiProperty({
    example: "objects@alex.com",
  })
  @IsEmail({}, { message: "Email must be a valid email address" })
  email: string;

  @ApiProperty({
    example: ["Backend", "AI"],
    type: [String],
  })
  @Transform(({ value }) => {
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [value]; // fallback: wrap string into array
      }
    }
    return value;
  })
  @IsArray({ message: "Fields must be an array" })
  @ArrayMinSize(1, {
    message: "Fields must contain at least 1 element",
  })
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
  @IsOptional()
  logoFile?: any;
}
