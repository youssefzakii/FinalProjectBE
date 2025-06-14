import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsString,
  MinLength,
  Max,
  Min,
  Matches,
  IsInt,
  IsArray,
  ArrayMinSize,
} from "class-validator";

class BaseAuthDto {
  @ApiProperty({
    example: "youssef",
  })
  username: string;
  @ApiProperty({
    example: "12345678",
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: "Password must be alphanumeric and at least 8 characters long",
  })
  password: string;
}
export class signInDto extends BaseAuthDto {}

export class signUpDto extends BaseAuthDto {
  @ApiProperty({
    example: "youssef zaki",
  })
  fullname: string;

  @ApiProperty({
    example: "email@gmail.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 25,
  })
  @IsInt()
  @Min(16)
  @Max(60)
  age: number;

  @ApiProperty({
    example: "01011121314",
  })
  @Matches(/^01[0-9]{9}$/, {
    message: "Phone number must be 11 digits and start with 01",
  })
  phone: string;

  @ApiProperty({
    example: ["Frontend", "Backend"],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1, { message: "At least one field should be added" })
  @IsString({ each: true })
  Fields: string[];
}
