import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  UploadedFile,
  UseInterceptors,
  Req,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CompanyService } from "./company.service";
import { SignUpCompanyDto, SignInCompanyDto } from "./dto/signup-company.dto";
import { ApiConsumes, ApiBody, ApiBearerAuth } from "@nestjs/swagger";
import { ForbiddenException } from "@nestjs/common";
import { UpdateCompanyDto } from "../../schemas/dto/update-company.dto";
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
  @Get("/getCompany")
  getCompany(@Req() req: Request) {
    const id = req['user']?.id;
    if (!id) throw new ForbiddenException("Unauthorized");
    return this.service.getCompanyById(id);
  }

  @ApiBearerAuth()
  @Get("/search")

  search(@Query("field") field: string) {
    console.log('ok');
    return this.service.findByField(field);
  }

  @ApiBearerAuth()
  @Get("/admin/all")
  getAllAdmin(@Req() req: Request) {
    if (req["user"]?.role !== "admin") throw new ForbiddenException("Unauthorized");
    return this.service.getAll();
  }

  @ApiBearerAuth()
  @Get("/admin/:id")
  getCompanyById(@Param("id") id: string, @Req() req: Request) {
    if (req["user"]?.role !== "admin") throw new ForbiddenException("Unauthorized");
    return this.service.getCompanyById(id);
  }

  @ApiBearerAuth()
  @Post("/admin")
  createCompanyAdmin(@Body() dto: UpdateCompanyDto, @Req() req: Request) {
    if (req["user"]?.role !== "admin") throw new ForbiddenException("Unauthorized");
    return this.service.createCompanyAdmin(dto);
  }

  @ApiBearerAuth()
  @Put("/admin/:id")
  updateCompanyById(@Param("id") id: string, @Body() dto: UpdateCompanyDto, @Req() req: Request) {
    if (req["user"]?.role !== "admin") throw new ForbiddenException("Unauthorized");
    return this.service.updateCompanyById(id, dto);
  }

  @ApiBearerAuth()
  @Delete("/admin/:id")
  deleteCompanyById(@Param("id") id: string, @Req() req: Request) {
    if (req["user"]?.role !== "admin") throw new ForbiddenException("Unauthorized");
    return this.service.deleteCompanyById(id);
  }
  @ApiBearerAuth()
  @Put()
  @UseInterceptors(FileInterceptor("logoFile"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        companyName: { type: 'string', example: 'anotherCompany.' },
        email: { type: 'string', example: 'acme@example.com' },
        Fields: {
          type: 'array',
          items: { type: 'string' },
          example: ['Frontend', 'Backend']
        },
        logoFile: {
          type: 'string',
          format: 'binary'
        }
      },
    },
  })
  async updateOwnCompany(
    @Body() dto: UpdateCompanyDto,
    @UploadedFile() logoFile: Express.Multer.File,
    @Req() req: Request
  ) {
    const companyName = req['user']?.companyName;
    const companyId = req["user"]?.id;
    console.log(companyId, req['user']);
    if (!companyName) {
      throw new ForbiddenException("Unauthorized");
    }

    if (logoFile) {
      const logoUrl = await this.service.uploadLogoToCloudinary(logoFile);
      dto.logo = logoUrl;
    }

    return this.service.updateCompanyById(companyId, dto);
  }
}
