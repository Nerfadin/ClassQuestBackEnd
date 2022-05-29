import { adminDb } from "../../app";
import {
  manyDocumentsOrErrorP,
  oneDocumentP,
} from "../../utils/firestoreUtils";
import { firestore } from "firebase-admin";
import { TEACHERS } from "../groups/GroupFirebaseAdaptor";
import { Singleton } from "../../utils/tsyringe";
import {
  InstitutionHasTeacherDto,
  InstitutionInfo,
  InstitutionRoles,
  UpdateInstitutionDto,
} from "./CreateInstitutionDto";
import { QUESTS } from "../quests/QuestFirebaseAdaptor";
import { InviteTeachersDto } from "./InviteTeachersDto";
import { Teacher } from "@interfaces/teacher";
import { BadRequestError } from "../../utils/errorUtils";
import { arrayContains } from "class-validator";
import {TeacherInstitutionPlan} from './institutionDtos/institutionDto';
export const INSTITUTIONHASPLAYER = "institution_Has_Player";
export const INSTITUTIONS_HAS_TEACHERS = "institutions_has_teachers";
export const INSTITUTIONS = "institutions";
export const INSTITUTION_SECURITY = "institution_security";
export const INSTITUTION_HAS_QUESTS = "institutions_has_quests";
export const INSTITUTIONINVITATIONS = "institutionInvitations";

@Singleton()
export class InstitutionFirestoreAdaptor {
  constructor() { }
  //pega o plano da instituição
  getTeacherInstitutionPlan(teacherId: string, institutionId: string) {
    return oneDocumentP<TeacherInstitutionPlan>(
      adminDb
        .collection(INSTITUTIONS_HAS_TEACHERS)
        .doc(`${teacherId}_${institutionId}`)
        .get()
    );
  }

  async getTeacherInstitutionsInfo(teacherId: string) {
    const teacher = await oneDocumentP<Teacher>(
      adminDb.collection(TEACHERS).doc(teacherId).get()
    );
    const teacherInstitutionIds = teacher.institutionIds;
    const institutionsPromisse = teacherInstitutionIds.map(async (id) => {
      return await this.getInstitutionInfo(id);
    });
    const institutions = Promise.all(institutionsPromisse);    
    return institutions;
  }

  async getInstitutionInfo(institutionId: string) {
    const institution = await oneDocumentP<UpdateInstitutionDto>(
      adminDb.collection(INSTITUTIONS).doc(institutionId).get()
    );
    console.log(institution);
    return institution;
  }
  async getInstitutionById(institutionId: string) {
    return await oneDocumentP<UpdateInstitutionDto>(adminDb.collection(INSTITUTIONS).doc(institutionId).get());
  }
  async updateInstitution(updateInstitutionDto: UpdateInstitutionDto) {
    return await adminDb
      .collection(INSTITUTIONS)
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
  async asignInstitutionOwner(institutionId: string, ownerId: string) {
    const institution = await adminDb.collection(INSTITUTIONS).doc(institutionId).set({
      ownerId: ownerId,
    }, {merge:true});
    return institution;
  }
  async getAllInstitutionTeachers(institutionId: string) {
    const teachers = adminDb
      .collection(TEACHERS)
      .where("institutionId", "array-contains", institutionId);
    return manyDocumentsOrErrorP<Teacher>(teachers.get());
  }
  async getAlTeacherInstitutionIds(institutionId: string) {
    const institutionTeachersSnapShot = await adminDb
      .collection(TEACHERS)
      .where("institutionId", "array-contains", institutionId);
    const teachers = await manyDocumentsOrErrorP<Teacher>(
      institutionTeachersSnapShot.get()
    );
    return teachers.map((teacher) => {
      return teacher.id;
    });
  }
  async findInstitutionByName(name: string){
    const institutionSnapshot = adminDb
      .collection(INSTITUTIONS)
      .where("name", "==", name);
    return await manyDocumentsOrErrorP<InstitutionInfo>(institutionSnapshot.get());
  }
  async addTeacherToInstitution(
    teacherId: string,
    institutionId: string,
    role: InstitutionRoles = InstitutionRoles.Teacher
  ) {
    const plan: Omit<TeacherInstitutionPlan, "id"> = {
      quests: 0,
      groups: 0,
      questsInGroups: 0,
      teacher: adminDb.collection(TEACHERS).doc(teacherId),
      institution: adminDb.collection(INSTITUTIONS).doc(institutionId),
      role,
      joinedAt: firestore.Timestamp.fromDate(new Date()),
    };
    //add teacher to InstitutionHasTeacher
    this.setTeacherPlan(teacherId, institutionId, plan);
  }
  async findTeacherInstitutionsIds(teacherId: string) {
    const teacher = await oneDocumentP<Teacher>(
      adminDb.collection(TEACHERS).doc(teacherId).get()
    );
    teacher.institutionIds.map((Id) => {
      return Id;
    });
  }
  async getInstituionBasicInfo(institutionId: string) {
    const institution = await oneDocumentP<InstitutionInfo>(
      adminDb.collection(INSTITUTIONS).doc(institutionId).get()
    );
    return institution;
  }


  async addPlayerToInstitution(playerId: string, institutionId: string) {

  }
  //Usa a coleção institutionInvitation para armazenar o invite quem faz a busca dos invites é o teacherService
  async inviteSingleTeacherToInstitution(
    invitation: InviteTeachersDto,
    directorId: string
  ) {
    //DONE
    const today = new Date();
    adminDb
      .collection(INSTITUTIONINVITATIONS)
      .doc(`${invitation.teacherId}_${invitation.institutionId}`)
      .set({
        directoreId: directorId,
        institutionId: invitation.institutionId,
        teacher: {
          name: invitation.teacher.name,
          email: invitation.teacher.email,
          invitedAt: firestore.Timestamp.fromDate(today),
        },
        teacherId: invitation.teacherId,
        invitationStatus: "pending",
        type: "enter_institution", // TODO: invitationTypes
      })
      .catch((err) => {
        throw err instanceof BadRequestError;
      });
  }
  //Alterar essa função
  async CreateInstitutionHasTeacherDocument(body: InstitutionHasTeacherDto) {
    const today = new Date();
    const teacherUpdated = adminDb
      .collection(TEACHERS)
      .doc(body.teacherId)
      .update({
        institutionId: firestore.FieldValue.arrayUnion(body.institutionId),
      });
    await adminDb
      .collection(INSTITUTIONS_HAS_TEACHERS)
      .doc(`${body.teacher.id}_${body.institutionId}`)
      .set(
        {
          groups: body.groups,
          institutionId: body.institutionId,
          joinedAt: firestore.Timestamp.fromDate(today),
          questInGroups: body.questsInGroup,
          role: body.role,
          teacherId: body.teacherId,
        },
        {
          merge: true
        }
      );
    return teacherUpdated;
  }
  async setInstitutionSecurity(
    institutionId: string,
    update: any // TODO: UpdateFirestoreDocument<InstitutionSecurity>
  ) {
    return adminDb
      .collection(INSTITUTION_SECURITY)
      .doc(institutionId)
      .set(update);
  }
  //returns true if invite already exists or teacher is in isntitutionAlready
  async checkForExistingInvitation(institutionId: string, teacherId: string) {
    const invitation = await adminDb
      .collection(TEACHERS)
      .doc(teacherId)
      .collection(INSTITUTIONINVITATIONS)
      .where("institutionId", "==", institutionId)
      .where("teacherId", "==", teacherId)
      .get();
    if (invitation.empty) {
      return false;
    } else {
      return true;
    }
  }
  async AddInstitutionToQuest(intitutionIds: string[], questId: string) {
    intitutionIds.map((institutionId: string) => {
      adminDb.collection(QUESTS).doc(questId).set({
        institutions: firestore.FieldValue.arrayUnion(institutionId)
      })
    })
  }
  //Se o professor já estiver na instituição retorna verdadeiro
  async checkIfTeacherIsInInstitution(
    teacherId: string,
    institutionId: string
  ) {
    const teacher = await oneDocumentP<Teacher>(
      adminDb.collection(TEACHERS).doc(teacherId).get()
    );
    if (!arrayContains(teacher.institutionIds, [institutionId])) {
      return false;
    } else {
      return true;
    }
  }
  async getInstitutionPendingInvitations(institutionId: string) {
    const invitations = await adminDb
      .collection(INSTITUTIONINVITATIONS)
      .where("invitationStatus", "==", "pending");
    return manyDocumentsOrErrorP<InviteTeachersDto>(invitations.get());
  }

  async setTeacherPlan(
    teacherId: string,
    institutionId: string,
    update: any // TODO: UpdateFirestoreDocument<TeacherInstitutionPlan>
  ) {
    return adminDb
      .collection(INSTITUTIONS_HAS_TEACHERS)
      .doc(`${teacherId}_${institutionId}`)
      .set(update, { merge: true });
  }
}
