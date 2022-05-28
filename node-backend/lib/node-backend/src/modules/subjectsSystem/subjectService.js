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
exports.SubjectService = void 0;
const tsyringe_1 = require("../../utils/tsyringe");
const SubjectErrors_1 = require("./SubjectErrors");
const subjectFirebaseAdapter_1 = require("./subjectFirebaseAdapter");
let SubjectService = class SubjectService {
    constructor(subjectDao) {
        this.subjectDao = subjectDao;
    }
    async CreateSubject(createSubjectDto) {
        const subject = await this.subjectDao.searchSubjectByFullName(createSubjectDto.subjectName);
        if (subject != null) {
            console.log(subject);
            try {
                await this.subjectDao.CreateSubject(createSubjectDto);
            }
            catch (err) {
                return SubjectErrors_1.SubjectErrors.SubjectNotFoundError(SubjectErrors_1.SubjectErrors.SubjectNotFoundError(err));
            }
        }
        else {
            return SubjectErrors_1.SubjectErrors.SubjectAlreadyExistsError("A matéria que você está tentando criar já " +
                "existe, por favor utilize a matéria existente ou crie uma matéria diferente.");
        }
        return;
    }
    async GetMainSubjects() {
        const subjects = await this.subjectDao.GetMainSubjects();
        return subjects;
    }
    async SearchSubjectBySlug(subjectSlug) {
        this.subjectDao.searchSubjectBySlug(subjectSlug);
    }
    async SearchSubjectByFullName(subjectFullName) {
        this.subjectDao.GetAllSubjectsWithName(subjectFullName);
    }
};
SubjectService = __decorate([
    (0, tsyringe_1.Singleton)(),
    __param(0, (0, tsyringe_1.Inject)(() => subjectFirebaseAdapter_1.SubjectFirebaseAdapter)),
    __metadata("design:paramtypes", [subjectFirebaseAdapter_1.SubjectFirebaseAdapter])
], SubjectService);
exports.SubjectService = SubjectService;
//# sourceMappingURL=subjectService.js.map