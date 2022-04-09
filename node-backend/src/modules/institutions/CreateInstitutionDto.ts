import { Timestamp } from "@interfaces/quest";
import { Teacher } from "@interfaces/teacher";

export interface CreateInstitutionDto {
    id: string,
    name: string,    
    institutionType: string
}
export interface institutionHasTeacherDto{
    teacherId: string,
    teacher: Teacher
    institutionId: string,    
    role: InstitutionRoles,
    quests: number,
    questsInGroup: number,
    joinedAt: Timestamp,
    groups: number

} 
export enum InstitutionRoles {
    Coordenator,
    Director,
    Teacher
}
export interface InstitutionInfo {
    name: string, 
}
export interface UpdateInstitutionDto {
    name: string,
    institutionId: string,
    contactInfo: {
    email: string,
    phone: string,
    responsableName: string
    }
    adress: {
        city: string,
        state: string,
        street: string        
    }
    directorId:string,
    CreatedAt: Timestamp
}
export interface ContactInfo {
    email: string,
    phone: string,
    responsableName: string
}