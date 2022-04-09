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
exports.SubjectFirebaseAdapter = exports.SUBJECTS = void 0;
const app_1 = require("../../../src/app");
const firestoreUtils_1 = require("../../utils/firestoreUtils");
exports.SUBJECTS = "subjects";
const teacherFirebaseAdaptor_1 = require("../teachers/teacherFirebaseAdaptor");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const tsyringe_1 = require("../../utils/tsyringe");
const SubjectErrors_1 = require("./SubjectErrors");
/**
 * DEFAULT SUBJECTS:
 * Matemnática - MAT
 * Língua Portuguesa - LP
 * Artes - ART.
 * História - HIST
 * Língua inglesa - LI
 */
let SubjectFirebaseAdapter = class SubjectFirebaseAdapter {
    async getTeacherSubjects(teacherId) {
        const subjects = await firestoreUtils_1.manyDocumentsOrErrorP(app_1.adminDb.collection(exports.SUBJECTS)
            .where("teacherId", "==", teacherId)
            .get());
        return subjects;
    }
    async searchSubjectBySlug(subjectSlug) {
        const subjects = await firestoreUtils_1.manyDocumentsOrErrorP(app_1.adminDb
            .collection(exports.SUBJECTS).
            where("slug", "==", subjectSlug)
            .get());
        if (subjects.length > 0) {
            return subjects.flatMap(subject => subject);
        }
        else {
            throw SubjectErrors_1.SubjectErrors.SubjectNotFoundError(new Error("Matéria não encontrada"));
        }
        ;
    }
    async CreateSubject(subjectName, subjectSlug) {
        const subject = {
            name: subjectName,
            slug: subjectSlug,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        const result = await app_1.adminDb.collection(exports.SUBJECTS).add(subject);
        const subjectDoc = await firestoreUtils_1.oneDocumentP(app_1.adminDb
            .collection(exports.SUBJECTS)
            .doc(result.id)
            .get());
        return subjectDoc;
    }
    async GetOldSubject() {
    }
    async UpdateSubject(subjectName, subjectSlug) {
    }
    async AddSubjectToTeacher(teacherId, subjectId) {
        //RETURN THE DOCUMENT THAT WAS WRITEN AFTER  WRITEN FIRESTORE
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
        return null;
    }
};
SubjectFirebaseAdapter = __decorate([
    tsyringe_1.Singleton()
], SubjectFirebaseAdapter);
exports.SubjectFirebaseAdapter = SubjectFirebaseAdapter;
//# sourceMappingURL=SubjectFirebaseAdapter.js.map