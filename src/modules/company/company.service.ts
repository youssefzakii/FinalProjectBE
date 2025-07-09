import {
  Injectable,
  ConflictException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Company } from "src/schemas/compnay.schema";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { SignInCompanyDto, SignUpCompanyDto } from "./dto/signup-company.dto";
import { uploadToCloudinary } from "src/middlewares/cloudinary.provider";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    private readonly configService: ConfigService
  ) {}

  async signUp(dto: SignUpCompanyDto, logoFile?: Express.Multer.File) {
    const { companyName, email, password, Fields } = dto;

    const existing = await this.companyModel.findOne({
      $or: [{ companyName }, { email }],
    });
    if (existing) throw new ConflictException("Company already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    let logoUrl: string | undefined = undefined;
    if (logoFile) {
      logoUrl = await uploadToCloudinary(logoFile);
    }

    const company = await this.companyModel.create({
      companyName,
      email,
      password: hashedPassword,
      Fields,
      logo: logoUrl || null,
    });

    const payload = { companyName: company.companyName, id: company._id };

    const token = jwt.sign(
      payload,
      this.configService.getOrThrow<string>("JWT_SECRET"),
      { expiresIn: "1d" }
    );

    return { token };
  }

  async signIn(dto: SignInCompanyDto) {
    const { companyName, password } = dto;

    const company = await this.companyModel.findOne({ companyName });
    if (!company) throw new ForbiddenException("Credentials incorrect");

    const isPasswordCorrect = await bcrypt.compare(password, company.password);
    if (!isPasswordCorrect)
      throw new ForbiddenException("Credentials incorrect");

    const token = jwt.sign(
      { companyName: company.companyName, id: company._id },
      this.configService.getOrThrow<string>("JWT_SECRET"),
      { expiresIn: "1d" }
    );

    return { token };
  }

  async findByField(field: string) {
    return this.companyModel.find({ Fields: field });
  }
}
