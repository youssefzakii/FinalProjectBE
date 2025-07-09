import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  UploadedFile,
  UseInterceptors,
  Req,

} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CompanyService } from "./company.service";
import { SignUpCompanyDto, SignInCompanyDto } from "./dto/signup-company.dto";
import { ApiConsumes, ApiBody, ApiBearerAuth } from "@nestjs/swagger";
import { ForbiddenException } from "@nestjs/common";
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
  @ApiBearerAuth()
  @Get("/allCompanies")
  getAll(@Req () req: Request) {
    if(req['user']?.role !== 'admin') throw new ForbiddenException('Unauthorized');
    return this.service.getAll();
  }
  @ApiBearerAuth()
  @Get("/search")

  search(@Query("field") field: string) {
    console.log('ok');
    return this.service.findByField(field);
  }

}
