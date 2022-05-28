/*import {
  AuthorizationError,
  UnexpectedError,
  EntityNotFoundError,
} from "../../utils/errorUtils";
*/
//import { UserService } from "../users/UserService";
import { InstitutionFirestoreAdaptor } from "./InstitutionFirestoreAdaptor";
//import { EmailService } from "../email/EmailService";
import { InviteTeachersDto } from "./InviteTeachersDto";
import dayjs from "dayjs";
import { firestore } from "firebase-admin";
import { TaskService } from "../tasks/TaskService";
import { Singleton, Inject } from "../../utils/tsyringe";
import { institutionHasTeacherDto, InstitutionRoles, UpdateInstitutionDto } from "./CreateInstitutionDto";

//Convidar professor para instituição: Done

//Aceitar e adicionar o professor na instituição: Done

//Buscar professores na instituição: Done

//buscar grupos na instituição: Done

//Buscar convites pendentes na instituição: Done



@Singleton()
export class InstitutionService {
  constructor(
    @Inject(() => InstitutionFirestoreAdaptor)
    private institutionDao: InstitutionFirestoreAdaptor,
    //@Inject(() => UserService) private userDao: UserService,
  //  @Inject(() => EmailService) private emailService: EmailService,
    @Inject(() => TaskService) private taskService: TaskService
  ) {}
  
  async createInstitution(createDto: any, teacherId: string, institutionId: string) {
    
    // TODO: CreateInstitutionDto
    const institution = await this.institutionDao.createInstitution(
      createDto,
      teacherId
    );
    const now = dayjs();
    const inOneMonth = now.add(1, "month");
    const security: any = {
      //TODO: InstitutionSecurity
      id: institution.id,
      plan: "paid",
      freeTrialStart: firestore.Timestamp.fromDate(now.toDate()),
      freeTrialEnd: firestore.Timestamp.fromDate(inOneMonth.toDate()),
    };
    await this.institutionDao.setInstitutionSecurity(institution.id, security);
    await this.taskService.scheduleInstitutionFreeTrialRemovalTask(security);
    await this.institutionDao.addTeacherToInstitution(teacherId, institutionId,
      InstitutionRoles.Teacher
      
    );
  }
  async InviteTeacherToInstitution (invitationDto: InviteTeachersDto){
    const errorPending = {
      message: "Esse professor já possuí uma solicitação pendente, caso ele não esteja vendo a solicitação,"
      + " por favor tente novamente mais tarde, ou entre em contato com o suporte.",
      status: 402,
      type: "invitation_Pending"
    }    
    const errorAlreadyInInstitution = {
      message: "Parece que esse professor já está na instituição,"
      + " Caso ele ainda não esteja na instituição, por favor tente novamente mais tarde, ou entre em contato com o suporte.",
      status: 402,
      type: "teacher_already_in"
    }    
    const hasInvitation = await this.institutionDao.checkForExistingInvitation(invitationDto.institutionId, invitationDto.teacherId);
   
    if (hasInvitation){
      console.log(errorPending)
      return errorPending;
    }
    if (await this.institutionDao.checkForExistingInvitation(invitationDto.institutionId, invitationDto.teacherId)){
      return errorPending
    }
    else if (await this.institutionDao.checkIfTeacherIsInInstitution(invitationDto.teacherId, invitationDto.institutionId))
      {
        return errorAlreadyInInstitution
      }
      return await this.institutionDao.inviteSingleTeacherToInstitution(invitationDto, invitationDto.directorId)
    
  }
  async updateInstitutionInfo (updateDto: UpdateInstitutionDto){
    return await this.institutionDao.updateInstitution(updateDto);
  }
  async getTeacherInstitutionsInfo (teacherId: string){
    return await this.institutionDao.getTeacherInstitutionsInfo(teacherId);
  }
  getInstitutionPendingInvitations(institutionId: string){
    return this.institutionDao.getInstitutionPendingInvitations(institutionId);
  }
  acceptTeacherIntoInstitution(body:institutionHasTeacherDto ){
    return this.institutionDao.CreateInstitutionHasTeacherDocument(body);
  }
  async getInstitutionTeachersIds (institutionId: string){
  const teachers = await this.institutionDao.getAllInstitutionTeachers(institutionId);
  console.log ("INSIDE INSTITUTIONsERVICE")
  return teachers
  }  
    
  /*
  async inviteTeachers(data: InviteTeachersDto): Promise<void> {
    const teacherPlan = await this.institutionDao
      .getTeacherInstitutionPlan(data.directorId, data.institutionId)
      .catch((err) => {
        throw err instanceof EntityNotFoundError
          ? new AuthorizationError({
              message: "Teacher is not in institution",
              details: err,
            })
          : err;
      });

    if (!["diretor", "coordenador"].includes(teacherPlan.role.toString())) {
      throw new AuthorizationError({
        message: "Você não tem autorização para convidar esses professores.",
      });
    }

    const tokenResults = await Promise.all(
      data.teachers
        .map((teacher) =>
          this.userDao.createUserRegisterToken(
            teacher.email,
            data.institutionId
          )
        )
        .map((token) => token.catch((err) => err as Error))
    );

    const sendEmailResults = await Promise.all(
      tokenResults.map((res, i) =>
        typeof res === "string"
          ? this.emailService
              .sendInviteTeacherEmail({
                email: data.teachers[i].email,
                token: res,
                name: data.teachers[i].name,
                institutionId: data.institutionId,
              })
              .catch((err) => err as Error)
          : Promise.resolve(res)
      )
    );
              
    const failures = sendEmailResults.filter(
      (e) => e instanceof Error
    ) as Error[];

    if (failures.length) {
      throw new UnexpectedError({ details: failures });
    } else return;
  }
*/  
}
