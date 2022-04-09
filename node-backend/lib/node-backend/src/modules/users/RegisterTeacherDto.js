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
exports.RegisterTeacherDto = void 0;
const class_validator_1 = require("class-validator");
class RegisterTeacherDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.Length(3),
    __metadata("design:type", String)
], RegisterTeacherDto.prototype, "nome", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], RegisterTeacherDto.prototype, "institution", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], RegisterTeacherDto.prototype, "token", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsPhoneNumber('BR'),
    __metadata("design:type", String)
], RegisterTeacherDto.prototype, "telefone", void 0);
__decorate([
    class_validator_1.IsEmail(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], RegisterTeacherDto.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], RegisterTeacherDto.prototype, "password", void 0);
exports.RegisterTeacherDto = RegisterTeacherDto;
//# sourceMappingURL=RegisterTeacherDto.js.map