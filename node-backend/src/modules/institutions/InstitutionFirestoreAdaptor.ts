import { adminDb } from "../../app";
import {
  manyDocumentsOrErrorP,
  oneDocumentP,
} from "../../utils/firestoreUtils";
import { firestore } from "firebase-admin";
import { TEACHERS } from "../groups/GroupFirebaseAdaptor";
import { Singleton } from "../../utils/tsyringe";
import {
  CreateInstitutionDto,
  institutionHasTeacherDto,
  InstitutionRoles,
  UpdateInstitutionDto,
} from "./CreateInstitutionDto";
import {QUESTS} from "../quests/QuestFirebaseAdaptor";
import { InviteTeachersDto } from "./InviteTeachersDto";
import { Teacher } from "@interfaces/teacher";
import { BadRequestError } from "../../utils/errorUtils";
import { arrayContains } from "class-validator";
import { Group } from "@interfaces/groups";
export const INSTITUTIONS_HAS_TEACHERS = "institutions_has_teachers";
export const INSTITUTIONS = "institutions";
export const INSTITUTION_SECURITY = "institution_security";
export const INSTITUTION_HAS_QUESTS = "institutions_has_quests";

export const INSTITUTIONINVITATIONS = "institutionInvitations";
export const GROUPS = "groups";
type TeacherInstitutionPlan = {
  groups: number;
  id: string;
  quests: number;
  questsInGroups: number;
  teacher: firestore.DocumentReference;
  institution: firestore.DocumentReference;
  role: InstitutionRoles;
  joinedAt: firestore.Timestamp;
};
export interface InstitutionInfo {
  name: string;
  id: string;
  coordenators: {
    name: string;
    email: string;
    id: string;
  }[];
  teachers: {
    name: string;
    email: string;
    id: string;
  }[];
}
@Singleton()
export class InstitutionFirestoreAdaptor {
  constructor() {}
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
    console.log("teacher Id: " + teacherId);
    const teacher = await oneDocumentP<Teacher>(
      adminDb.collection(TEACHERS).doc(teacherId).get()
    );
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
  async createInstitution(createDto: CreateInstitutionDto, teacherId: string) {
    return await adminDb.collection(INSTITUTIONS).add(createDto);
  }
  async getInstitutionInfo(institutionId: string) {
    const institution = await oneDocumentP<UpdateInstitutionDto>(
      adminDb.collection(INSTITUTIONS).doc(institutionId).get()
    );
    console.log(institution);
    return institution;
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

  async getAllInstitutionTeachers(institutionId: string) {
    const teachers = adminDb
      .collection(TEACHERS)
      .where("institutionId", "array-contains", institutionId);
    return manyDocumentsOrErrorP<Teacher>(teachers.get());
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

  
  async addPlayerToInstitution (playerId: string, institutionId: string) {
    
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
  async CreateInstitutionHasTeacherDocument(body: institutionHasTeacherDto) {
    const today = new Date();
    const teacherUpdated = adminDb
      .collection(TEACHERS)
      .doc(body.teacherId)
      .update({
        institutionId: firestore.FieldValue.arrayUnion(body.institutionId),
      });
    console.log("createInstitutionHasTeacherDocument");
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
        { merge: true }
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
  async AddInstitutionToQuest(intitutionIds: string[], questId: string){
    intitutionIds.map((institutionId: string) => {
      adminDb.collection(QUESTS).doc(questId).set ({
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
  async getTeacherStatistics(teacherId: string) {
    //pegar quantidade de alunos que interagiram com esse professor.
    // pegar quantidade de grupos que esse professor tem.
    //pegar quantidade de quests que esse professor publicou.
   
    const teacherGroups = await adminDb
      .collection(GROUPS)
      .where("teacherId", "==", teacherId);
    const groups = await manyDocumentsOrErrorP<Group>(teacherGroups.get());
    const groupPlayersIds = groups.flatMap((group) => {
      return group.players;
    });
    console.log(groupPlayersIds);
    let playerIds: string[] = [];
    groupPlayersIds.map((id) => {
      console.log("id dentro do map " + id)
      if (!arrayContains(playerIds, [id])) {

        playerIds.push(id);
      }else {
        console.log("já tinha o id")
      }
    });
    return playerIds.length;

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
