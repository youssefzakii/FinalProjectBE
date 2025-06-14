import { Model } from 'mongoose';
import { IJwtPayload } from 'src/interfaces/jwt.payload.interface';
import { User } from 'src/schemas/user.schema';
export declare class UsersService {
    private readonly UserModel;
    constructor(UserModel: Model<User>);
    getAllUsers(): import("mongoose").Query<(import("mongoose").Document<unknown, {}, User, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[], import("mongoose").Document<unknown, {}, User, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, User, "find", {}>;
    getProfile(user: IJwtPayload): Promise<(import("mongoose").Document<unknown, {}, User, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
}
