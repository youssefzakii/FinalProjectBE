import { signInDto, signUpDto } from "./dto/signup.dto";
import { User } from "src/schemas/user.schema";
import { Model } from "mongoose";
import { ConfigService } from "@nestjs/config";
export declare class AuthService {
    private readonly userModel;
    private readonly configService;
    constructor(userModel: Model<User>, configService: ConfigService);
    signUp(dto: signUpDto): Promise<{
        fullname: string;
        username: string;
        email: string;
        age: number;
        phone: string;
        role: string;
        _id: import("mongoose").Types.ObjectId;
        __v: number;
    }>;
    signIn(dto: signInDto): Promise<{
        token: string;
    }>;
}
