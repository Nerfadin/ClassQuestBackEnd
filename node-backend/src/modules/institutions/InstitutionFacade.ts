import { InstitutionService } from "./InstitutionService";
import { Singleton, Inject } from "../../utils/tsyringe";
//import { validateDto } from "../../utils/validateDto";
import { TeacherService } from '../teachers/teacherService';
import { UserFirestoreAdaptor } from "../users/UserFirestoreAdaptor";
import { firestore } from "firebase-admin";
import { institutionHasTeacherDto } from "./CreateInstitutionDto";
//import { Group } from "@interfaces/groups";

//Convidar professor para instituição: Done

//Aceitar e adicionar o professor na instituição: Done

//Buscar professores na instituição: Done

//buscar grupos na instituição: Done

//Buscar convites pendentes na instituição: Done


@Singleton()
export class InstitutionFacade {
  constructor(
    @Inject(() => TeacherService) private teacherService: TeacherService,
    @Inject(() => InstitutionService) private institutionService: InstitutionService,
    @Inject(() => UserFirestoreAdaptor) private userDao: UserFirestoreAdaptor
  ) { }
  async getInstitutionGroups(institutionId: string) {
    const institutionTeachers = await this.institutionService.getInstitutionTeachersIds(institutionId)
    const groupsPromisse = await institutionTeachers.map(async (teacher) => {
      return await this.teacherService.getTeacherGroups(teacher.id);
    })
    const groups = Promise.all(groupsPromisse);
    return groups;
  }
  async getInstitutionTeachers(institutionId: string){
    /*const teacherIds = await this.institutionService.getInstitutionTeachersIds(institutionId);
    console.log("inside institution Facade[teacher ids ]" + teacherIds)
    const teachers = await teacherIds.map(async (id) => {
      console.log("inside institution Facade[teachers]");
      return await this.teacherService.getTeacher(id);    
    })
     console.log(teachers)
     return Promise.all(teachers)
  */
 
 }
  async AcceptTeacherInInstitution(body: institutionHasTeacherDto){
    await this.teacherService.acceptInstitutionInvite(body.teacherId,body.institutionId); //muda o status do convite pra acepted
    await this.institutionService.acceptTeacherIntoInstitution(body);
    await this.userDao.updateTeacher(body.teacherId, {
      institutionIds: firestore.FieldValue.arrayUnion(body.institutionId) //colocar essa parte dentro do service
    });

  }
}



