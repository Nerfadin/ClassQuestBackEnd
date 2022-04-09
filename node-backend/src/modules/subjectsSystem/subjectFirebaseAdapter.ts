import { adminDb } from "../../../src/app";
import { manyDocumentsOrErrorP, oneDocumentP } from "../../utils/firestoreUtils";
import { ISubjectDto } from "./subjectsDtos";
export const SUBJECTS = "subjects";
import { TEACHERS } from "../teachers/teacherFirebaseAdaptor";
import firebaseAdmin from 'firebase-admin';
import { Singleton } from "../../utils/tsyringe";
import { SubjectErrors } from "./SubjectErrors";
/**
 * DEFAULT SUBJECTS:
 * Matemnática - MAT
 * Língua Portuguesa - LP
 * Artes - ART.
 * História - HIST
 * Língua inglesa - LI
 */
@Singleton()
export class SubjectFirebaseAdapter {
    async getTeacherSubjects(teacherId: string) {
        const subjects = await manyDocumentsOrErrorP<ISubjectDto[]>(
            adminDb.collection(SUBJECTS)
                .where("teacherId", "==", teacherId)
                .get());
        return subjects;
    }
    async searchSubjectBySlug(subjectSlug: string) {
        const subjects = await manyDocumentsOrErrorP<ISubjectDto[]>(
            adminDb
                .collection(SUBJECTS).
                where("slug", "==", subjectSlug)
                .get());
        if (subjects.length > 0) { return subjects.flatMap(subject => subject) }
        else { throw SubjectErrors.SubjectNotFoundError(new Error("Matéria não encontrada"))};
    }
    async CreateSubject(subjectName: string, subjectSlug: string) {
        const subject = {
            name: subjectName,
            slug: subjectSlug,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        const result = await adminDb.collection(SUBJECTS).add(subject);
        const subjectDoc = await oneDocumentP<ISubjectDto>(adminDb
            .collection(SUBJECTS)
            .doc(result.id)
            .get());
        return subjectDoc;
    }
    async GetOldSubject() {
    }
    async UpdateSubject(subjectName: string, subjectSlug: string) {

    }
    async AddSubjectToTeacher(teacherId: string, subjectId: string) {
        //RETURN THE DOCUMENT THAT WAS WRITEN AFTER  WRITEN FIRESTORE
        try {
            const teacher = await adminDb.collection(TEACHERS).doc(teacherId).set({
                subjects: firebaseAdmin.firestore.FieldValue.arrayUnion(subjectId),
            }, { merge: true });
            return teacher;
        } catch (e) {
            console.log(e);
            return e;
        }
        return null;
    }
}    
