import {TeacherFirebaseAdaptor} from './teacherFirebaseAdaptor'
import {Singleton, Inject} from '../../utils/tsyringe';
import { TeacherImportDto, TeacherInstitutionStatistics } from '@interfaces/teacher';

@Singleton()
export class TeacherService {
    constructor(
        @Inject(() =>  TeacherFirebaseAdaptor) private teacherDao: TeacherFirebaseAdaptor 
    ){

    }
    async getTeacherGroups (teacherId: string){
       const groups = await this.teacherDao.findGroupsFromTeacher(teacherId);
       return groups
    }
    async acceptInstitutionInvite (teacherId: string, institutionId: string){
        return await this.teacherDao.acceptInstitutionInvite(teacherId, institutionId);
    }
     async getTeacher(teacherId: string){
        return await this.teacherDao.getTeacher(teacherId);
    }
    async createTeacherDocument(teacherDto: TeacherImportDto, teacherId: string){
        await this.teacherDao.createTeacherDocument(teacherDto, teacherId);
    }
     async getTeacherStatisctics (teacherId: string){
        
        const groupCount = await this.teacherDao.getTeacherGroupsCount(teacherId);
        const studentsCount = await this.teacherDao.getTeacherPlayersIds(teacherId);
        const teacherStatistics: TeacherInstitutionStatistics = {
            id: teacherId,
            groupsCount: groupCount,
            studentsCount: studentsCount
        }
        return teacherStatistics;
     }
     addTeacherToInstitution (teacherId: string, institutionId: string){
     return this.teacherDao.addInstitutionToTeacher(teacherId, institutionId);   
     }
     async getTeacherGroupsCount (teacherId: string){
        return await this.teacherDao.getTeacherGroupsCount(teacherId);
     }
}