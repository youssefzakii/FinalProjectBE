"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../../schemas/user.schema");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config_1 = require("@nestjs/config");
const stream_1 = require("stream");
let AuthService = class AuthService {
    userModel;
    configService;
    cloudinary;
    constructor(userModel, configService, cloudinary) {
        this.userModel = userModel;
        this.configService = configService;
        this.cloudinary = cloudinary;
    }
    async signUp(dto, avatar) {
        const { username, email, password, Fields } = dto;
        let user = await this.userModel.findOne({ username });
        if (user) {
            throw new common_1.ConflictException("Username is found before");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let avatarUrl = undefined;
        if (avatar) {
            avatarUrl = await new Promise((resolve, reject) => {
                const upload = this.cloudinary.uploader.upload_stream({ folder: "avatars" }, (error, result) => {
                    if (error)
                        return reject(error);
                    resolve(result?.secure_url);
                });
                stream_1.Readable.from(avatar.buffer).pipe(upload);
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
        const { password: _pass, ...result } = user.toJSON();
        return result;
    }
    async signIn(dto) {
        const user = await this.userModel.findOne({ username: dto.username });
        if (!user) {
            throw new common_1.ForbiddenException("Credentials provided are incorrect");
        }
        const isPasswordMatching = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordMatching) {
            throw new common_1.ForbiddenException("Credentials provided are incorrect");
        }
        const payload = { username: user.username, id: user._id };
        const token = jwt.sign(payload, this.configService.getOrThrow("JWT_SECRET"));
        return {
            token,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, common_1.Inject)("CLOUDINARY")),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService, Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map