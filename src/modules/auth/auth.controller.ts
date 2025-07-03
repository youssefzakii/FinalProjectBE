import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { signInDto, signUpDto } from "./dto/signup.dto";
import { AuthService } from "./auth.service";
import { ApiConsumes, ApiBody } from "@nestjs/swagger";

@Controller("/auth")
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post("/sign-up")
  @UseInterceptors(FileInterceptor("avatar"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        username: { type: "string", example: "youssef" },
        password: { type: "string", example: "12345678" },
        email: { type: "string", example: "email@gmail.com" },
        Fields: {
          type: "array",
          items: { type: "string" },
          example: ["Frontend", "Backend"],
        },
        avatar: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  signUp(@Body() dto: signUpDto, @UploadedFile() avatar: Express.Multer.File) {
    return this.service.signUp(dto, avatar);
  }

  @Post("/sign-in")
  signIn(@Body() dto: signInDto) {
    return this.service.signIn(dto);
  }
}
