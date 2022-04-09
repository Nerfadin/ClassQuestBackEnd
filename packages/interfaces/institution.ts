import { Timestamp } from "./quest";
export interface UpdateInstitutionInfoDto {
  name: string;
  institutionId: string;
  directorId: string;
  contactInfo: {
    email: string;
    phone: string;
    responsableName: string;
  };
  adress: {
    city: string;
    state: string;
    street: string;
  };
}

export interface InvitationDto {
  directorId: string;
  institutionId: string;
  teacher: {
    name: string;
    email: string;
  };
  teacherId: string;
}
export enum InstitutionRoles {
  teacher,
  director,
  coordenator,
}
export interface AddTeacherIntoIntitution {
  teacherId: string;
  teacher: string;
  institutionId: string;
  role: InstitutionRoles;
  quests: number;
  questsInGroup: number;
  joinedAt: Timestamp;
  groups: string[];
}
export interface InstitutionInfo {
  id: any;

}