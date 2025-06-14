declare class BaseAuthDto {
    username: string;
    password: string;
}
export declare class signInDto extends BaseAuthDto {
}
export declare class signUpDto extends BaseAuthDto {
    fullname: string;
    email: string;
    age: number;
    phone: string;
    Fields: string[];
}
export {};
