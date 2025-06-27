import { UsersService } from "./users.services";
export declare class UsersController {
    private readonly service;
    constructor(service: UsersService);
    getAllUsers(): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("../../schemas/user.schema").User, {}> & import("../../schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[], import("mongoose").Document<unknown, {}, import("../../schemas/user.schema").User, {}> & import("../../schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, import("../../schemas/user.schema").User, "find", {}>;
    getProfile(req: Request): Promise<(import("mongoose").Document<unknown, {}, import("../../schemas/user.schema").User, {}> & import("../../schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    search(field: string): Promise<(import("mongoose").Document<unknown, {}, import("../../schemas/user.schema").User, {}> & import("../../schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
}
