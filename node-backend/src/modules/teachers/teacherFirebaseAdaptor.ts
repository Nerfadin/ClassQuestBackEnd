import { Teacher } from "@interfaces/teacher";
import {
  manyDocumentsOrErrorP,
  oneDocumentP,
} from "../../utils/firestoreUtils";
import { adminDb } from "../../app";
import { InviteTeachersDto } from "../institutions/InviteTeachersDto";
import { GROUPS } from "../groups/GroupFirebaseAdaptor";
import { Group } from "@interfaces/groups";
import { INSTITUTIONINVITATIONS } from "../institutions/InstitutionFirestoreAdaptor";
import { arrayContains } from "class-validator";
import { firestore } from "firebase-admin";
export const TEACHERS = "teachers";
export class TeacherFirebaseAdaptor {
  async findTeacherByEmail(email: string) {
    const teacherQuerry = await adminDb
      .collection(TEACHERS)
      .where("email", "==", email);
    const teacher = await  manyDocumentsOrErrorP<Teacher>(teacherQuerry.get());
    return teacher.flatMap ((t) => {
      return t;
    })
  }
  async addInstitutionToTeacher (teacherId: string, institutionId: string){
    const teacher = await adminDb.collection(TEACHERS).doc(teacherId).set ({
      institutionId: firestore.FieldValue.arrayUnion(institutionId)
    }, {merge: true})
    return teacher;

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
      } else {
      }
    });
    return playerIds.length; 
  }
  async getPendingInvites(teacherId: string) {
    const invitation = await adminDb
      .collection(INSTITUTIONINVITATIONS)
      .where("teacherId", "==", teacherId)
      .where("type", "==", "enter_institution");
    manyDocumentsOrErrorP<InviteTeachersDto>(invitation.get());
  }
  
  async acceptInstitutionInvite(teacherId: string, institutionId: string) {
    const acceptedInvitation = await adminDb
      .collection(INSTITUTIONINVITATIONS)
      .doc(`${teacherId}_${institutionId}`)
      .update({
        invitationStatus: "accepted",
      });
    return acceptedInvitation;
  }
  async getTeacherPlayersIds(teacherId: string) {
    const teacherGroups = await adminDb
      .collection(GROUPS)
      .where("teacherId", "==", teacherId);
    const groups = await manyDocumentsOrErrorP<Group>(teacherGroups.get());
    const groupPlayersIds = groups.flatMap((group) => {
      return group.players;
    });
    let playerIds: string[] = [];
    groupPlayersIds.map((id) => {
      console.log("id dentro do map " + id);
      if (!arrayContains(playerIds, [id])) {
        playerIds.push(id);
      } else {
        console.log("já tinha o id");
      }
    });
    return playerIds.length;
  }
  async getTeacherGroupsCount(teacherId: string) {
    const groups = await adminDb
      .collection(GROUPS)
      .where("teacherId", "==", teacherId);
    const groupsCount = (await groups.get()).docs.length;
    return groupsCount;
  }



  getTeacher(teacherId: string) {
    const teacher = oneDocumentP<Teacher>(
      adminDb.collection(TEACHERS).doc(teacherId).get()
    );
    return teacher;
  }
  async getTeacherGroups(teacherId: string) {
    const groups = await manyDocumentsOrErrorP<Group>(
      adminDb.collection(GROUPS).where("teacherId", "==", teacherId).get()
    );
    return groups;
  }
  async findTeacherInstitutionsIds(teacherId: string) {
    const teacher = await oneDocumentP<Teacher>(
      adminDb.collection(TEACHERS).doc(teacherId).get()
    );
    teacher.institutionIds.map((Id) => {
      return Id;
    });
  }
  async getTeacherInstitutionsIds(teacherId: string) {
    console.log("teacher Id: " + teacherId);
    const teacher = await oneDocumentP<Teacher>(
      adminDb.collection(TEACHERS).doc(teacherId).get()
    );
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
  async findGroupsFromTeacher(teacherId: string): Promise<Group[]> {
    const teachersSnapshot = await adminDb
      .collection(GROUPS)
      .where("teacherId", "==", teacherId);
    return manyDocumentsOrErrorP<Group>(teachersSnapshot.get());
  }
}
