import { AuthService } from './auth.service';
import { signInDto, signUpDto } from './dto/signup.dto';
export declare class AuthController {
    private readonly service;
    constructor(service: AuthService);
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
