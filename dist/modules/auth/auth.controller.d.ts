import { signInDto, signUpDto } from "./dto/signup.dto";
import { AuthService } from "./auth.service";
export declare class AuthController {
    private readonly service;
    constructor(service: AuthService);
    signUp(dto: signUpDto, avatar: Express.Multer.File): Promise<{
        username: string;
        email: string;
        role: string;
        avatar: string;
        _id: import("mongoose").Types.ObjectId;
        __v: number;
    }>;
    signIn(dto: signInDto): Promise<{
        token: string;
    }>;
}
