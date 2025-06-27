import { signInDto, signUpDto } from "./dto/signup.dto";
import { User } from "src/schemas/user.schema";
import { Model } from "mongoose";
import { ConfigService } from "@nestjs/config";
import { v2 as CloudinaryType } from "cloudinary";
export declare class AuthService {
    private readonly userModel;
    private readonly configService;
    private cloudinary;
    constructor(userModel: Model<User>, configService: ConfigService, cloudinary: typeof CloudinaryType);
    signUp(dto: signUpDto, avatar?: Express.Multer.File): Promise<{
        username: string;
        email: string;
        role: string;
        Fields: string[];
        avatar: string;
        _id: import("mongoose").Types.ObjectId;
        __v: number;
    }>;
    signIn(dto: signInDto): Promise<{
        token: string;
    }>;
}
