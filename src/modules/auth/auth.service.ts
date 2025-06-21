import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { signInDto, signUpDto } from "./dto/signup.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/schemas/user.schema";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService
  ) {}
  async signUp(dto: signUpDto) {
    const { fullname, username, email, password, phone, age, Fields } = dto;
    let user = await this.userModel.findOne({ username });

    if (user) {
      throw new ConflictException("Username is found before");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await this.userModel.create({
      fullname,
      email,
      phone,
      username,
      password: hashedPassword,
      age,
      Fields,
      role: "user",
    });

    const { password: _pass, ...result } = user.toJSON();
    return result;
  }
  async signIn(dto: signInDto) {
    const user = await this.userModel.findOne({ username: dto.username });

    if (!user) {
      throw new ForbiddenException("Credentails provided are incorrect");
    }

    const isPasswordMatching = await bcrypt.compare(
      dto.password,
      user.password
    );

    if (!isPasswordMatching) {
      throw new ForbiddenException("Credentails provided are incorrect");
    }

    const { username } = user.toJSON();

    const payload = { username };

    const token = jwt.sign(
      payload,
      this.configService.getOrThrow<string>("JWT_SECRET")
    );

    return {
      token,
    };
  }
}
