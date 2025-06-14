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
let AuthService = class AuthService {
    userModel;
    configService;
    constructor(userModel, configService) {
        this.userModel = userModel;
        this.configService = configService;
    }
    async signUp(dto) {
        const { fullname, username, email, password, phone, age, Fields } = dto;
        let user = await this.userModel.findOne({ username });
        if (user) {
            throw new common_1.ConflictException("Username is found before");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await this.userModel.create({
            fullname,
            email,
            phone,
            username,
            password: hashedPassword,
            age,
            Fields,
            role: "user",
        });
        const { password: _pass, ...result } = user.toJSON();
        return result;
    }
    async signIn(dto) {
        const user = await this.userModel.findOne({ username: dto.username });
        if (!user) {
            throw new common_1.ForbiddenException("Credentails provided are incorrect");
        }
        const isPasswordMatching = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordMatching) {
            throw new common_1.ForbiddenException("Credentails provided are incorrect");
        }
        const { username } = user.toJSON();
        const payload = { username };
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
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map