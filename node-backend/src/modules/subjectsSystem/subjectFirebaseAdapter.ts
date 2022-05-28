import { adminDb } from "../../../src/app";
import { manyDocumentsOrErrorP, oneDocumentP } from "../../utils/firestoreUtils";
import { SubjectDto, CreateSubjectDto } from "./subjectsDtos";
export const SUBJECTS = "subject";
export const SUBJECTHASQUEST = "subjectHasQuest";

import { TEACHERS } from "../teachers/teacherFirebaseAdaptor";
import firebaseAdmin from 'firebase-admin';
import { Singleton } from "../../utils/tsyringe";

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
@Singleton()
export class SubjectFirebaseAdapter {
    async getTeacherSubjects(teacherId: string) {
        const subjects = await manyDocumentsOrErrorP<SubjectDto[]>(
            adminDb.collection(SUBJECTS)
                .where("teacherId", "==", teacherId)
                .get());
        return subjects;
    }
    async searchSubjectBySlug(subjectSlug: string) {
        const subjects = await manyDocumentsOrErrorP<SubjectDto[]>(
            adminDb
                .collection(SUBJECTS).
                where("subjectSlug", "==", subjectSlug).get());
        if (subjects.length > 0) {
            return subjects.flatMap(subject => subject)
        }
        else {
            return null
        }
    }
    async searchSubjectByFullName(subjectSlug: string) {
        const subjects = await manyDocumentsOrErrorP<SubjectDto[]>(
            adminDb
                .collection(SUBJECTS).
                where("slug", "==", subjectSlug)
                .get());
        if (subjects.length > 0) { return subjects.flatMap(subject => subject) } else {
            return []
        }
    }
    async GetMainSubjects() {
        const subjects = await manyDocumentsOrErrorP<SubjectDto[]>(adminDb.collection(SUBJECTS).where("isMain", "==", true).get());

        return subjects

    }
    async CreateSubject(createSubjectDto: CreateSubjectDto) {
        const subject = {
            subjectName: createSubjectDto.subjectName,
            subjectSlug: createSubjectDto.subjectSlug,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isMain: createSubjectDto.isMain
        };
        const result = await adminDb.collection(SUBJECTS).add(subject);
        const subjectDoc = await oneDocumentP<SubjectDto>(adminDb
            .collection(SUBJECTS)
            .doc(result.id)
            .get());
        return subjectDoc;
    }
    async GetOldSubject(subjectName: string, subjectSlug: string) {
        const oldSubject = await manyDocumentsOrErrorP<SubjectDto>(adminDb.collection(SUBJECTS).where("name", "==", subjectName).where("teahcer", "==", subjectSlug).get());
        return oldSubject[0];
    }
    async UpdateSubject(subjectName: string, subjectSlug: string) {
        const oldSubject = await this.GetOldSubject(subjectName, subjectSlug)
        this.CreateSubject({
            subjectName: oldSubject.subjectName,
            subjectSlug: oldSubject.subjectSlug,
            createdAt: oldSubject.createdAt,
            updatedAt: oldSubject.updatedAt,
            isMain: false
        })
    }
    async GetAllSubjectsWithName(subjectName: string) {
        const subjects = await manyDocumentsOrErrorP<SubjectDto[]>(adminDb.collection(SUBJECTS).get());
        return subjects;
    }
    async AddSubjectToTeacher(teacherId: string, subjectId: string) {
        try {
            const teacher = await adminDb.collection(TEACHERS).doc(teacherId).set({
                subjects: firebaseAdmin.firestore.FieldValue.arrayUnion(subjectId),
            }, { merge: true });
            return teacher;
        } catch (e) {
            console.log(e);
            return e;
        }
    }
    async AddSubjectToQuest(subjectId: string, subjectSlug: string, questId: string, teacherId: string) {
        await adminDb.collection(SUBJECTHASQUEST).doc(`${subjectSlug}_${questId}`).set({
            subjectId: subjectId,
            questId: questId,
            teacherId: teacherId
        });
    }
}    
