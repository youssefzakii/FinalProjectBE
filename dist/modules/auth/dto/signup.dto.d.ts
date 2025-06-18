declare class BaseAuthDto {
    username: string;
    password: string;
}
export declare class signInDto extends BaseAuthDto {
}
export declare class signUpDto extends BaseAuthDto {
    email: string;
    Fields: string[];
}
export {};
