"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherFirebaseAdaptor = exports.TEACHERS = void 0;
const firestoreUtils_1 = require("../../utils/firestoreUtils");
const app_1 = require("../../app");
const GroupFirebaseAdaptor_1 = require("../groups/GroupFirebaseAdaptor");
const InstitutionFirestoreAdaptor_1 = require("../institutions/InstitutionFirestoreAdaptor");
const class_validator_1 = require("class-validator");
const firebase_admin_1 = require("firebase-admin");
exports.TEACHERS = "teachers";
class TeacherFirebaseAdaptor {
    async findTeacherByEmail(email) {
        const teacherQuerry = app_1.adminDb
            .collection(exports.TEACHERS)
            .where("email", "==", email);
        const teacher = await (0, firestoreUtils_1.manyDocumentsOrErrorP)(teacherQuerry.get());
        return teacher.flatMap((t) => {
            return t;
        });
    }
    async addInstitutionToTeacher(teacherId, institutionId) {
        const teacher = await app_1.adminDb.collection(exports.TEACHERS).doc(teacherId).set({
            institutionId: firebase_admin_1.firestore.FieldValue.arrayUnion(institutionId)
        }, { merge: true });
        return teacher;
    }
    async createTeacherDoc(RegisterTeacherDto) {
    }
    async getTeacherStatistics(teacherId) {
        //pegar quantidade de alunos que interagiram com esse professor.
        // pegar quantidade de grupos que esse professor tem.
        //pegar quantidade de quests que esse professor publicou.
        const teacherGroups = await app_1.adminDb
            .collection(GroupFirebaseAdaptor_1.GROUPS)
            .where("teacherId", "==", teacherId);
        const groups = await (0, firestoreUtils_1.manyDocumentsOrErrorP)(teacherGroups.get());
        const groupPlayersIds = groups.flatMap((group) => {
            return group.players;
        });
        console.log(groupPlayersIds);
        let playerIds = [];
        groupPlayersIds.map((id) => {
            console.log("id dentro do map " + id);
            if (!(0, class_validator_1.arrayContains)(playerIds, [id])) {
                playerIds.push(id);
            }
            else {
            }
        });
        return playerIds.length;
    }
    async getPendingInvites(teacherId) {
        const invitation = await app_1.adminDb
            .collection(InstitutionFirestoreAdaptor_1.INSTITUTIONINVITATIONS)
            .where("teacherId", "==", teacherId)
            .where("type", "==", "enter_institution");
        (0, firestoreUtils_1.manyDocumentsOrErrorP)(invitation.get());
    }
    async acceptInstitutionInvite(teacherId, institutionId) {
        const acceptedInvitation = await app_1.adminDb
            .collection(InstitutionFirestoreAdaptor_1.INSTITUTIONINVITATIONS)
            .doc(`${teacherId}_${institutionId}`)
            .update({
            invitationStatus: "accepted",
        });
        return acceptedInvitation;
    }
    async getTeacherPlayersIds(teacherId) {
        const teacherGroups = await app_1.adminDb
            .collection(GroupFirebaseAdaptor_1.GROUPS)
            .where("teacherId", "==", teacherId);
        const groups = await (0, firestoreUtils_1.manyDocumentsOrErrorP)(teacherGroups.get());
        const groupPlayersIds = groups.flatMap((group) => {
            return group.players;
        });
        let playerIds = [];
        groupPlayersIds.map((id) => {
            console.log("id dentro do map " + id);
            if (!(0, class_validator_1.arrayContains)(playerIds, [id])) {
                playerIds.push(id);
            }
            else {
                console.log("já tinha o id");
            }
        });
        return playerIds.length;
    }
    async getTeacherGroupsCount(teacherId) {
        const groups = await app_1.adminDb
            .collection(GroupFirebaseAdaptor_1.GROUPS)
            .where("teacherId", "==", teacherId);
        const groupsCount = (await groups.get()).docs.length;
        return groupsCount;
    }
    getTeacher(teacherId) {
        const teacher = (0, firestoreUtils_1.oneDocumentP)(app_1.adminDb.collection(exports.TEACHERS).doc(teacherId).get());
        return teacher;
    }
    async getTeacherGroups(teacherId) {
        const groups = await (0, firestoreUtils_1.manyDocumentsOrErrorP)(app_1.adminDb.collection(GroupFirebaseAdaptor_1.GROUPS).where("teacherId", "==", teacherId).get());
        return groups;
    }
    async findTeacherInstitutionsIds(teacherId) {
        const teacher = await (0, firestoreUtils_1.oneDocumentP)(app_1.adminDb.collection(exports.TEACHERS).doc(teacherId).get());
        teacher.institutionIds.map((Id) => {
            return Id;
        });
    }
    async getTeacherInstitutionsIds(teacherId) {
        console.log("teacher Id: " + teacherId);
        const teacher = await (0, firestoreUtils_1.oneDocumentP)(app_1.adminDb.collection(exports.TEACHERS).doc(teacherId).get());
        const teacherInstitutionIds = teacher.institutionIds;
        console.log("teacherInstitutionsIds " + teacherInstitutionIds);
        const institutionsPromisse = teacherInstitutionIds.map(async (id) => {
            console.log("institutionId: " + id);
            return id;
        });
        const institutions = Promise.all(institutionsPromisse);
        console.log("institutions beign logged");
        console.log(institutions);
        return institutions;
    }
    async findGroupsFromTeacher(teacherId) {
        const teachersSnapshot = await app_1.adminDb
            .collection(GroupFirebaseAdaptor_1.GROUPS)
            .where("teacherId", "==", teacherId);
        return (0, firestoreUtils_1.manyDocumentsOrErrorP)(teachersSnapshot.get());
    }
}
exports.TeacherFirebaseAdaptor = TeacherFirebaseAdaptor;
//# sourceMappingURL=teacherFirebaseAdaptor.js.map