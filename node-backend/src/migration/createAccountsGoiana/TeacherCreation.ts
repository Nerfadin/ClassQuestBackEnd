import { TeacherService } from "../../modules/teachers/teacherService";
import { Inject, Singleton } from '../../utils/tsyringe';
import { AuthenticationService } from "../../modules/authentication/AuthenticationService";
import { TeacherImportDto } from "@interfaces/teacher";
import { adminDb} from "../../app";

@Singleton()
export class TeacherCreationService {
    constructor(
        @Inject(() =>AuthenticationService)
     private authenticationDao: AuthenticationService,
        @Inject(() => TeacherService)
     private teacherService: TeacherService,
    ) {
    }    
    async teacherCreated(teacherEmail: string){
        const teacher = (await adminDb.collection('teachers').where('email', '==', teacherEmail).get());
        if (teacher.empty){ 
            console.log('Teacher not found');
        return true;
        }else{
        
            console.log('Teacher found');    
        }
       
    }
    async createTeacher(userInfo: TeacherImportDto[]) {
      
        userInfo['data'].map(async(teacher) =>{

            if (await this.teacherCreated(teacher.email)){
        
        const registeredTeacher = await this.authenticationDao.RegisterTeacher(teacher.email, teacher.password);
        await this.teacherService.createTeacherDocument(teacher, registeredTeacher.localId);
    
               console.log(teacher.email);
            }
            else{

            }    
            });
            }
        }
    