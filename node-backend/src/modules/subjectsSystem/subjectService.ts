import { Inject, Singleton } from "../../utils/tsyringe";
import { SubjectErrors } from "./SubjectErrors";
import { SubjectFirebaseAdapter } from "./subjectFirebaseAdapter";
import { CreateSubjectDto } from "./subjectsDtos";
@Singleton()
export class SubjectService {
  constructor(
    @Inject(() => SubjectFirebaseAdapter) private subjectDao: SubjectFirebaseAdapter
  ) { }
  async CreateSubject(createSubjectDto: CreateSubjectDto){
    const subject = await this.subjectDao.searchSubjectByFullName(createSubjectDto.subjectName);
    if (subject != null) {
      console.log(subject)
      try {
        await this.subjectDao.CreateSubject(
          createSubjectDto)
      } catch (err) {
        return SubjectErrors.SubjectNotFoundError(
          SubjectErrors.SubjectNotFoundError(err));
      }
    } else {
      return SubjectErrors.SubjectAlreadyExistsError("A matéria que você está tentando criar já " +
      "existe, por favor utilize a matéria existente ou crie uma matéria diferente.")
    }
    return 
  }
  async GetMainSubjects(){
    const subjects = await this.subjectDao.GetMainSubjects();
    return subjects;
  }
  async SearchSubjectBySlug(subjectSlug: string){
    this.subjectDao.searchSubjectBySlug(subjectSlug)
  }
  async SearchSubjectByFullName(subjectFullName: string){
    this.subjectDao.GetAllSubjectsWithName(subjectFullName)
  }

}



