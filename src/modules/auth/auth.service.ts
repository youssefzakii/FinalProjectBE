import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Inject,
} from "@nestjs/common";
import { signInDto, signUpDto } from "./dto/signup.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/schemas/user.schema";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { Readable } from "stream";
import { v2 as CloudinaryType } from "cloudinary";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
    @Inject("CLOUDINARY") private cloudinary: typeof CloudinaryType
  ) {}

  async signUp(dto: signUpDto, avatar?: Express.Multer.File) {
    const { username, email, password, Fields } = dto;

    let user = await this.userModel.findOne({ username });
    if (user) {
      throw new ConflictException("Username is found before");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let avatarUrl: string | undefined = undefined;

    if (avatar) {
      avatarUrl = await new Promise((resolve, reject) => {
        const upload = this.cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result?.secure_url);
          }
        );
        Readable.from(avatar.buffer).pipe(upload);
      });
    }

    user = await this.userModel.create({
      username,
      email,
      password: hashedPassword,
      Fields,
      role: "user",
      avatar: avatarUrl,
    });

    const payload = { username: user.username, id: user._id, role:user.role };

    const token = jwt.sign(
      payload,
      this.configService.getOrThrow<string>("JWT_SECRET")
    );

    // const { password: _pass, ...result } = user.toJSON();
    // console.log(Fields);
    // console.log(result);
    console.log(user);

    return { token };
  }

  async signIn(dto: signInDto) {
    const user = await this.userModel.findOne({ username: dto.username });
    if (!user) {
      throw new ForbiddenException("Credentials provided are incorrect");
    }

    const isPasswordMatching = await bcrypt.compare(
      dto.password,
      user.password
    );

    if (!isPasswordMatching) {
      throw new ForbiddenException("password is incorrect");
    }
    console.log(user.role);
    const payload = { username: user.username, id: user._id , role:user.role};

    const token = jwt.sign(
      payload,
      this.configService.getOrThrow<string>("JWT_SECRET")
    );

    return {
      token,
    };
  }
}
