"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectFirebaseAdapter = exports.SUBJECTHASQUEST = exports.SUBJECTS = void 0;
const app_1 = require("../../../src/app");
const firestoreUtils_1 = require("../../utils/firestoreUtils");
exports.SUBJECTS = "subject";
exports.SUBJECTHASQUEST = "subjectHasQuest";
const teacherFirebaseAdaptor_1 = require("../teachers/teacherFirebaseAdaptor");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const tsyringe_1 = require("../../utils/tsyringe");
/*
* DEFAULT SUBJECTS:
* Matemática - MAT
* Língua Portuguesa - LP
* Artes - ART.
* História - HIST
* Língua inglesa - LI
* Educação Física - EDF
* Geografia - GEO
* Ciências - CIE
* Química - QUI
* Física - FIS
* Biologia - BIO
* Sociologia - SOC
* Filosofia - FIL
 */
let SubjectFirebaseAdapter = class SubjectFirebaseAdapter {
    async getTeacherSubjects(teacherId) {
        const subjects = await (0, firestoreUtils_1.manyDocumentsOrErrorP)(app_1.adminDb.collection(exports.SUBJECTS)
            .where("teacherId", "==", teacherId)
            .get());
        return subjects;
    }
    async searchSubjectBySlug(subjectSlug) {
        const subjects = await (0, firestoreUtils_1.manyDocumentsOrErrorP)(app_1.adminDb
            .collection(exports.SUBJECTS).
            where("subjectSlug", "==", subjectSlug).get());
        if (subjects.length > 0) {
            return subjects.flatMap(subject => subject);
        }
        else {
            return null;
        }
    }
    async searchSubjectByFullName(subjectSlug) {
        const subjects = await (0, firestoreUtils_1.manyDocumentsOrErrorP)(app_1.adminDb
            .collection(exports.SUBJECTS).
            where("slug", "==", subjectSlug)
            .get());
        if (subjects.length > 0) {
            return subjects.flatMap(subject => subject);
        }
        else {
            return [];
        }
    }
    async GetMainSubjects() {
        const subjects = await (0, firestoreUtils_1.manyDocumentsOrErrorP)(app_1.adminDb.collection(exports.SUBJECTS).where("isMain", "==", true).get());
        return subjects;
    }
    async CreateSubject(createSubjectDto) {
        const subject = {
            subjectName: createSubjectDto.subjectName,
            subjectSlug: createSubjectDto.subjectSlug,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isMain: createSubjectDto.isMain
        };
        const result = await app_1.adminDb.collection(exports.SUBJECTS).add(subject);
        const subjectDoc = await (0, firestoreUtils_1.oneDocumentP)(app_1.adminDb
            .collection(exports.SUBJECTS)
            .doc(result.id)
            .get());
        return subjectDoc;
    }
    async GetOldSubject(subjectName, subjectSlug) {
        const oldSubject = await (0, firestoreUtils_1.manyDocumentsOrErrorP)(app_1.adminDb.collection(exports.SUBJECTS).where("name", "==", subjectName).where("teahcer", "==", subjectSlug).get());
        return oldSubject[0];
    }
    async UpdateSubject(subjectName, subjectSlug) {
        const oldSubject = await this.GetOldSubject(subjectName, subjectSlug);
        this.CreateSubject({
            subjectName: oldSubject.subjectName,
            subjectSlug: oldSubject.subjectSlug,
            createdAt: oldSubject.createdAt,
            updatedAt: oldSubject.updatedAt,
            isMain: false
        });
    }
    async GetAllSubjectsWithName(subjectName) {
        const subjects = await (0, firestoreUtils_1.manyDocumentsOrErrorP)(app_1.adminDb.collection(exports.SUBJECTS).get());
        return subjects;
    }
    async AddSubjectToTeacher(teacherId, subjectId) {
        try {
            const teacher = await app_1.adminDb.collection(teacherFirebaseAdaptor_1.TEACHERS).doc(teacherId).set({
                subjects: firebase_admin_1.default.firestore.FieldValue.arrayUnion(subjectId),
            }, { merge: true });
            return teacher;
        }
        catch (e) {
            console.log(e);
            return e;
        }
    }
    async AddSubjectToQuest(subjectId, subjectSlug, questId, teacherId) {
        await app_1.adminDb.collection(exports.SUBJECTHASQUEST).doc(`${subjectSlug}_${questId}`).set({
            subjectId: subjectId,
            questId: questId,
            teacherId: teacherId
        });
    }
};
SubjectFirebaseAdapter = __decorate([
    (0, tsyringe_1.Singleton)()
], SubjectFirebaseAdapter);
exports.SubjectFirebaseAdapter = SubjectFirebaseAdapter;
//# sourceMappingURL=subjectFirebaseAdapter.js.map