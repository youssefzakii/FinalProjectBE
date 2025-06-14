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
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpDto = exports.signInDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class BaseAuthDto {
    username;
    password;
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "youssef",
    }),
    __metadata("design:type", String)
], BaseAuthDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "12345678",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.Matches)(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
        message: "Password must be alphanumeric and at least 8 characters long",
    }),
    __metadata("design:type", String)
], BaseAuthDto.prototype, "password", void 0);
class signInDto extends BaseAuthDto {
}
exports.signInDto = signInDto;
class signUpDto extends BaseAuthDto {
    fullname;
    email;
    age;
    phone;
    Fields;
}
exports.signUpDto = signUpDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "youssef zaki",
    }),
    __metadata("design:type", String)
], signUpDto.prototype, "fullname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "email@gmail.com",
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], signUpDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 25,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(16),
    (0, class_validator_1.Max)(60),
    __metadata("design:type", Number)
], signUpDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "01011121314",
    }),
    (0, class_validator_1.Matches)(/^01[0-9]{9}$/, {
        message: "Phone number must be 11 digits and start with 01",
    }),
    __metadata("design:type", String)
], signUpDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ["Frontend", "Backend"],
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1, { message: "At least one field should be added" }),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], signUpDto.prototype, "Fields", void 0);
//# sourceMappingURL=signup.dto.js.map