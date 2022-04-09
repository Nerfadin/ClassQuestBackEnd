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
exports.InstitutionFacade = void 0;
const InstitutionService_1 = require("./InstitutionService");
const tsyringe_1 = require("../../utils/tsyringe");
//import { validateDto } from "../../utils/validateDto";
const teacherService_1 = require("../teachers/teacherService");
const UserFirestoreAdaptor_1 = require("../users/UserFirestoreAdaptor");
const firebase_admin_1 = require("firebase-admin");
//import { Group } from "@interfaces/groups";
//Convidar professor para instituição: Done
//Aceitar e adicionar o professor na instituição: Done
//Buscar professores na instituição: Done
//buscar grupos na instituição: Done
//Buscar convites pendentes na instituição: Done
let InstitutionFacade = class InstitutionFacade {
    constructor(teacherService, institutionService, userDao) {
        this.teacherService = teacherService;
        this.institutionService = institutionService;
        this.userDao = userDao;
    }
    async getInstitutionGroups(institutionId) {
        const institutionTeachers = await this.institutionService.getInstitutionTeachersIds(institutionId);
        const groupsPromisse = await institutionTeachers.map(async (teacher) => {
            return await this.teacherService.getTeacherGroups(teacher.id);
        });
        const groups = Promise.all(groupsPromisse);
        return groups;
    }
    async getInstitutionTeachers(institutionId) {
        /*const teacherIds = await this.institutionService.getInstitutionTeachersIds(institutionId);
        console.log("inside institution Facade[teacher ids ]" + teacherIds)
        const teachers = await teacherIds.map(async (id) => {
          console.log("inside institution Facade[teachers]");
          return await this.teacherService.getTeacher(id);
        })
         console.log(teachers)
         return Promise.all(teachers)
      */
    }
    async AcceptTeacherInInstitution(body) {
        await this.teacherService.acceptInstitutionInvite(body.teacherId, body.institutionId); //muda o status do convite pra acepted
        await this.institutionService.acceptTeacherIntoInstitution(body);
        await this.userDao.updateTeacher(body.teacherId, {
            institutionIds: firebase_admin_1.firestore.FieldValue.arrayUnion(body.institutionId) //colocar essa parte dentro do service
        });
    }
};
InstitutionFacade = __decorate([
    tsyringe_1.Singleton(),
    __param(0, tsyringe_1.Inject(() => teacherService_1.TeacherService)),
    __param(1, tsyringe_1.Inject(() => InstitutionService_1.InstitutionService)),
    __param(2, tsyringe_1.Inject(() => UserFirestoreAdaptor_1.UserFirestoreAdaptor)),
    __metadata("design:paramtypes", [teacherService_1.TeacherService,
        InstitutionService_1.InstitutionService,
        UserFirestoreAdaptor_1.UserFirestoreAdaptor])
], InstitutionFacade);
exports.InstitutionFacade = InstitutionFacade;
//# sourceMappingURL=InstitutionFacade.js.map