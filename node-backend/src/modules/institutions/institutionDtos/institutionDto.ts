import { firestore } from "firebase-admin";
import { InstitutionRoles } from "../CreateInstitutionDto";

export type TeacherInstitutionPlan = {
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