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
exports.TeacherCreationService = void 0;
const teacherService_1 = require("../../modules/teachers/teacherService");
const tsyringe_1 = require("../../utils/tsyringe");
const AuthenticationService_1 = require("../../modules/authentication/AuthenticationService");
const app_1 = require("../../app");
let TeacherCreationService = class TeacherCreationService {
    constructor(authenticationDao, teacherService) {
        this.authenticationDao = authenticationDao;
        this.teacherService = teacherService;
    }
    async teacherCreated(teacherEmail) {
        const teacher = (await app_1.adminDb.collection('teachers').where('email', '==', teacherEmail).get());
        if (teacher.empty) {
            console.log('Teacher not found');
            return true;
        }
        else {
            console.log('Teacher found');
        }
    }
    async createTeacher(userInfo) {
        userInfo['data'].map(async (teacher) => {
            if (await this.teacherCreated(teacher.email)) {
                const registeredTeacher = await this.authenticationDao.RegisterTeacher(teacher.email, teacher.password);
                await this.teacherService.createTeacherDocument(teacher, registeredTeacher.localId);
                console.log(teacher.email);
            }
            else {
            }
        });
    }
};
TeacherCreationService = __decorate([
    (0, tsyringe_1.Singleton)(),
    __param(0, (0, tsyringe_1.Inject)(() => AuthenticationService_1.AuthenticationService)),
    __param(1, (0, tsyringe_1.Inject)(() => teacherService_1.TeacherService)),
    __metadata("design:paramtypes", [AuthenticationService_1.AuthenticationService,
        teacherService_1.TeacherService])
], TeacherCreationService);
exports.TeacherCreationService = TeacherCreationService;
//# sourceMappingURL=TeacherCreation.js.map