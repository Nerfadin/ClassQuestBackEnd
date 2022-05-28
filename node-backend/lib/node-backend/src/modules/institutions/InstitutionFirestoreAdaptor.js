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
exports.InstitutionFirestoreAdaptor = exports.INSTITUTIONINVITATIONS = exports.INSTITUTION_HAS_QUESTS = exports.INSTITUTION_SECURITY = exports.INSTITUTIONS = exports.INSTITUTIONS_HAS_TEACHERS = exports.INSTITUTIONHASPLAYER = void 0;
const app_1 = require("../../app");
const firestoreUtils_1 = require("../../utils/firestoreUtils");
const firebase_admin_1 = require("firebase-admin");
const GroupFirebaseAdaptor_1 = require("../groups/GroupFirebaseAdaptor");
const tsyringe_1 = require("../../utils/tsyringe");
const CreateInstitutionDto_1 = require("./CreateInstitutionDto");
const QuestFirebaseAdaptor_1 = require("../quests/QuestFirebaseAdaptor");
const errorUtils_1 = require("../../utils/errorUtils");
const class_validator_1 = require("class-validator");
exports.INSTITUTIONHASPLAYER = "institution_Has_Player";
exports.INSTITUTIONS_HAS_TEACHERS = "institutions_has_teachers";
exports.INSTITUTIONS = "institutions";
exports.INSTITUTION_SECURITY = "institution_security";
exports.INSTITUTION_HAS_QUESTS = "institutions_has_quests";
exports.INSTITUTIONINVITATIONS = "institutionInvitations";
let InstitutionFirestoreAdaptor = class InstitutionFirestoreAdaptor {
    constructor() { }
    //pega o plano da instituição
    getTeacherInstitutionPlan(teacherId, institutionId) {
        return (0, firestoreUtils_1.oneDocumentP)(app_1.adminDb
            .collection(exports.INSTITUTIONS_HAS_TEACHERS)
            .doc(`${teacherId}_${institutionId}`)
            .get());
    }
    async getTeacherInstitutionsInfo(teacherId) {
        console.log("teacher Id: " + teacherId);
        const teacher = await (0, firestoreUtils_1.oneDocumentP)(app_1.adminDb.collection(GroupFirebaseAdaptor_1.TEACHERS).doc(teacherId).get());
        const teacherInstitutionIds = teacher.institutionIds;
        console.log("teacherInstitutionsIds " + teacherInstitutionIds);
        const institutionsPromisse = teacherInstitutionIds.map(async (id) => {
            console.log("institutionId: " + id);
            return await this.getInstitutionInfo(id);
        });
        const institutions = Promise.all(institutionsPromisse);
        console.log("institutions beign logged");
        console.log(institutions);
        return institutions;
    }
    async createInstitution(createDto, teacherId) {
        return await app_1.adminDb.collection(exports.INSTITUTIONS).add(createDto);
    }
    async getInstitutionInfo(institutionId) {
        const institution = await (0, firestoreUtils_1.oneDocumentP)(app_1.adminDb.collection(exports.INSTITUTIONS).doc(institutionId).get());
        console.log(institution);
        return institution;
    }
    async updateInstitution(updateInstitutionDto) {
        return await app_1.adminDb
            .collection(exports.INSTITUTIONS)
            .doc(updateInstitutionDto.institutionId)
            .update({
            name: updateInstitutionDto.name,
            institutionId: updateInstitutionDto.institutionId,
            directorId: updateInstitutionDto.directorId,
            contactInfo: {
                email: updateInstitutionDto.contactInfo.email,
                phone: updateInstitutionDto.contactInfo.phone,
                responsableName: updateInstitutionDto.contactInfo.responsableName,
            },
            adress: {
                city: updateInstitutionDto.adress.city,
                state: updateInstitutionDto.adress.state,
                street: updateInstitutionDto.adress.street,
            },
            updated: true,
        });
    }
    async asignInstitutionOwner(institutionId, ownerId) {
        const institution = await app_1.adminDb.collection(exports.INSTITUTIONS).doc(institutionId).set({
            ownerId: ownerId,
        }, { merge: true });
        return institution;
    }
    async getAllInstitutionTeachers(institutionId) {
        const teachers = app_1.adminDb
            .collection(GroupFirebaseAdaptor_1.TEACHERS)
            .where("institutionId", "array-contains", institutionId);
        return (0, firestoreUtils_1.manyDocumentsOrErrorP)(teachers.get());
        /*const institutionRef = await adminDb.collection(INSTITUTIONS).doc(institutionId);
        console.log("insitutionRef: " + institutionRef)
        const institutionHsTeacherDocs = await manyDocumentsOrErrorP<institutionHasTeacherDto>(adminDb
          .collection(INSTITUTIONS_HAS_TEACHERS)
          .where("institution", "==", institutionRef)
          .get());
        console.log("institutionHsTeacherDocs " + institutionHsTeacherDocs.length);
    
        const teachersIds = institutionHsTeacherDocs.map((doc) => {
          console.log("doc inside map")
          console.log(doc.teacherId + " ")
          return doc.teacher.id;
        })
        console.log("teacherIds: " + teachersIds)
        return teachersIds */
    }
    async addRoleToInstitution(userId, institutionId) {
    }
    async getAlTeacherInstitutionIds(institutionId) {
        const institutionTeachersSnapShot = await app_1.adminDb
            .collection(GroupFirebaseAdaptor_1.TEACHERS)
            .where("institutionId", "array-contains", institutionId);
        const teachers = await (0, firestoreUtils_1.manyDocumentsOrErrorP)(institutionTeachersSnapShot.get());
        return teachers.map((teacher) => {
            return teacher.id;
        });
    }
    async addTeacherToInstitution(teacherId, institutionId, role = CreateInstitutionDto_1.InstitutionRoles.Teacher) {
        const plan = {
            quests: 0,
            groups: 0,
            questsInGroups: 0,
            teacher: app_1.adminDb.collection(GroupFirebaseAdaptor_1.TEACHERS).doc(teacherId),
            institution: app_1.adminDb.collection(exports.INSTITUTIONS).doc(institutionId),
            role,
            joinedAt: firebase_admin_1.firestore.Timestamp.fromDate(new Date()),
        };
        //add teacher to InstitutionHasTeacher
        this.setTeacherPlan(teacherId, institutionId, plan);
    }
    async findTeacherInstitutionsIds(teacherId) {
        const teacher = await (0, firestoreUtils_1.oneDocumentP)(app_1.adminDb.collection(GroupFirebaseAdaptor_1.TEACHERS).doc(teacherId).get());
        teacher.institutionIds.map((Id) => {
            return Id;
        });
    }
    async getInstituionBasicInfo(institutionId) {
        const institution = await (0, firestoreUtils_1.oneDocumentP)(app_1.adminDb.collection(exports.INSTITUTIONS).doc(institutionId).get());
        return institution;
    }
    async addPlayerToInstitution(playerId, institutionId) {
    }
    //Usa a coleção institutionInvitation para armazenar o invite quem faz a busca dos invites é o teacherService
    async inviteSingleTeacherToInstitution(invitation, directorId) {
        //DONE
        const today = new Date();
        app_1.adminDb
            .collection(exports.INSTITUTIONINVITATIONS)
            .doc(`${invitation.teacherId}_${invitation.institutionId}`)
            .set({
            directoreId: directorId,
            institutionId: invitation.institutionId,
            teacher: {
                name: invitation.teacher.name,
                email: invitation.teacher.email,
                invitedAt: firebase_admin_1.firestore.Timestamp.fromDate(today),
            },
            teacherId: invitation.teacherId,
            invitationStatus: "pending",
            type: "enter_institution", // TODO: invitationTypes
        })
            .catch((err) => {
            throw err instanceof errorUtils_1.BadRequestError;
        });
    }
    //Alterar essa função
    async CreateInstitutionHasTeacherDocument(body) {
        const today = new Date();
        const teacherUpdated = app_1.adminDb
            .collection(GroupFirebaseAdaptor_1.TEACHERS)
            .doc(body.teacherId)
            .update({
            institutionId: firebase_admin_1.firestore.FieldValue.arrayUnion(body.institutionId),
        });
        await app_1.adminDb
            .collection(exports.INSTITUTIONS_HAS_TEACHERS)
            .doc(`${body.teacher.id}_${body.institutionId}`)
            .set({
            groups: body.groups,
            institutionId: body.institutionId,
            joinedAt: firebase_admin_1.firestore.Timestamp.fromDate(today),
            questInGroups: body.questsInGroup,
            role: body.role,
            teacherId: body.teacherId,
        }, {
            merge: true
        });
        return teacherUpdated;
    }
    async setInstitutionSecurity(institutionId, update // TODO: UpdateFirestoreDocument<InstitutionSecurity>
    ) {
        return app_1.adminDb
            .collection(exports.INSTITUTION_SECURITY)
            .doc(institutionId)
            .set(update);
    }
    //returns true if invite already exists or teacher is in isntitutionAlready
    async checkForExistingInvitation(institutionId, teacherId) {
        const invitation = await app_1.adminDb
            .collection(GroupFirebaseAdaptor_1.TEACHERS)
            .doc(teacherId)
            .collection(exports.INSTITUTIONINVITATIONS)
            .where("institutionId", "==", institutionId)
            .where("teacherId", "==", teacherId)
            .get();
        if (invitation.empty) {
            return false;
        }
        else {
            return true;
        }
    }
    async AddInstitutionToQuest(intitutionIds, questId) {
        intitutionIds.map((institutionId) => {
            app_1.adminDb.collection(QuestFirebaseAdaptor_1.QUESTS).doc(questId).set({
                institutions: firebase_admin_1.firestore.FieldValue.arrayUnion(institutionId)
            });
        });
    }
    //Se o professor já estiver na instituição retorna verdadeiro
    async checkIfTeacherIsInInstitution(teacherId, institutionId) {
        const teacher = await (0, firestoreUtils_1.oneDocumentP)(app_1.adminDb.collection(GroupFirebaseAdaptor_1.TEACHERS).doc(teacherId).get());
        if (!(0, class_validator_1.arrayContains)(teacher.institutionIds, [institutionId])) {
            return false;
        }
        else {
            return true;
        }
    }
    async getInstitutionPendingInvitations(institutionId) {
        const invitations = await app_1.adminDb
            .collection(exports.INSTITUTIONINVITATIONS)
            .where("invitationStatus", "==", "pending");
        return (0, firestoreUtils_1.manyDocumentsOrErrorP)(invitations.get());
    }
    async setTeacherPlan(teacherId, institutionId, update // TODO: UpdateFirestoreDocument<TeacherInstitutionPlan>
    ) {
        return app_1.adminDb
            .collection(exports.INSTITUTIONS_HAS_TEACHERS)
            .doc(`${teacherId}_${institutionId}`)
            .set(update, { merge: true });
    }
};
InstitutionFirestoreAdaptor = __decorate([
    (0, tsyringe_1.Singleton)(),
    __metadata("design:paramtypes", [])
], InstitutionFirestoreAdaptor);
exports.InstitutionFirestoreAdaptor = InstitutionFirestoreAdaptor;
//# sourceMappingURL=InstitutionFirestoreAdaptor.js.map