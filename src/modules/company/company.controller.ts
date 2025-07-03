import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CompanyService } from "./company.service";
import { SignUpCompanyDto, SignInCompanyDto } from "./dto/signup-company.dto";
import { ApiConsumes, ApiBody } from "@nestjs/swagger";
@Controller("/company")
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Post("/sign-up")
  @UseInterceptors(FileInterceptor("logoFile"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: SignUpCompanyDto })
  async signUp(
    @Body() dto: SignUpCompanyDto,
    @UploadedFile() logoFile?: Express.Multer.File
  ) {
    return this.service.signUp(dto, logoFile);
  }

  @Post("/sign-in")
  async signIn(@Body() dto: SignInCompanyDto) {
    return this.service.signIn(dto);
  }

  @Get("/search")
  search(@Query("field") field: string) {
    return this.service.findByField(field);
  }
}
