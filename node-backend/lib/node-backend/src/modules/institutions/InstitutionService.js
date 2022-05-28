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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionService = void 0;
/*import {
  AuthorizationError,
  UnexpectedError,
  EntityNotFoundError,
} from "../../utils/errorUtils";
*/
//import { UserService } from "../users/UserService";
const InstitutionFirestoreAdaptor_1 = require("./InstitutionFirestoreAdaptor");
const dayjs_1 = __importDefault(require("dayjs"));
const firebase_admin_1 = require("firebase-admin");
const TaskService_1 = require("../tasks/TaskService");
const tsyringe_1 = require("../../utils/tsyringe");
const CreateInstitutionDto_1 = require("./CreateInstitutionDto");
//Convidar professor para instituição: Done
//Aceitar e adicionar o professor na instituição: Done
//Buscar professores na instituição: Done
//buscar grupos na instituição: Done
//Buscar convites pendentes na instituição: Done
let InstitutionService = class InstitutionService {
    constructor(institutionDao, 
    //@Inject(() => UserService) private userDao: UserService,
    //  @Inject(() => EmailService) private emailService: EmailService,
    taskService) {
        this.institutionDao = institutionDao;
        this.taskService = taskService;
    }
    async createInstitution(createDto, teacherId, institutionId) {
        // TODO: CreateInstitutionDto
        const institution = await this.institutionDao.createInstitution(createDto, teacherId);
        const now = (0, dayjs_1.default)();
        const inOneMonth = now.add(1, "month");
        const security = {
            //TODO: InstitutionSecurity
            id: institution.id,
            plan: "paid",
            freeTrialStart: firebase_admin_1.firestore.Timestamp.fromDate(now.toDate()),
            freeTrialEnd: firebase_admin_1.firestore.Timestamp.fromDate(inOneMonth.toDate()),
        };
        await this.institutionDao.setInstitutionSecurity(institution.id, security);
        await this.taskService.scheduleInstitutionFreeTrialRemovalTask(security);
        await this.institutionDao.addTeacherToInstitution(teacherId, institutionId, CreateInstitutionDto_1.InstitutionRoles.Teacher);
    }
    async InviteTeacherToInstitution(invitationDto) {
        const errorPending = {
            message: "Esse professor já possuí uma solicitação pendente, caso ele não esteja vendo a solicitação,"
                + " por favor tente novamente mais tarde, ou entre em contato com o suporte.",
            status: 402,
            type: "invitation_Pending"
        };
        const errorAlreadyInInstitution = {
            message: "Parece que esse professor já está na instituição,"
                + " Caso ele ainda não esteja na instituição, por favor tente novamente mais tarde, ou entre em contato com o suporte.",
            status: 402,
            type: "teacher_already_in"
        };
        const hasInvitation = await this.institutionDao.checkForExistingInvitation(invitationDto.institutionId, invitationDto.teacherId);
        if (hasInvitation) {
            console.log(errorPending);
            return errorPending;
        }
        if (await this.institutionDao.checkForExistingInvitation(invitationDto.institutionId, invitationDto.teacherId)) {
            return errorPending;
        }
        else if (await this.institutionDao.checkIfTeacherIsInInstitution(invitationDto.teacherId, invitationDto.institutionId)) {
            return errorAlreadyInInstitution;
        }
        return await this.institutionDao.inviteSingleTeacherToInstitution(invitationDto, invitationDto.directorId);
    }
    async updateInstitutionInfo(updateDto) {
        return await this.institutionDao.updateInstitution(updateDto);
    }
    async getTeacherInstitutionsInfo(teacherId) {
        return await this.institutionDao.getTeacherInstitutionsInfo(teacherId);
    }
    getInstitutionPendingInvitations(institutionId) {
        return this.institutionDao.getInstitutionPendingInvitations(institutionId);
    }
    acceptTeacherIntoInstitution(body) {
        return this.institutionDao.CreateInstitutionHasTeacherDocument(body);
    }
    async getInstitutionTeachersIds(institutionId) {
        const teachers = await this.institutionDao.getAllInstitutionTeachers(institutionId);
        console.log("INSIDE INSTITUTIONsERVICE");
        return teachers;
    }
};
InstitutionService = __decorate([
    (0, tsyringe_1.Singleton)(),
    __param(0, (0, tsyringe_1.Inject)(() => InstitutionFirestoreAdaptor_1.InstitutionFirestoreAdaptor)),
    __param(1, (0, tsyringe_1.Inject)(() => TaskService_1.TaskService)),
    __metadata("design:paramtypes", [InstitutionFirestoreAdaptor_1.InstitutionFirestoreAdaptor,
        TaskService_1.TaskService])
], InstitutionService);
exports.InstitutionService = InstitutionService;
//# sourceMappingURL=InstitutionService.js.map