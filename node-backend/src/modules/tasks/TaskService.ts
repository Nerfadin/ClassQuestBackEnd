import { TaskFirestoreAdaptor } from "./TaskFirestoreAdaptor";
import { Singleton, Inject } from "../../utils/tsyringe";

@Singleton()
export class TaskService {
  constructor(
    @Inject(() => TaskFirestoreAdaptor) private taskDao: TaskFirestoreAdaptor
  ) {}
  scheduleFreeTrialRemovalTask = this.taskDao.scheduleFreeTrialRemovalTask;

  scheduleInstitutionFreeTrialRemovalTask = this.taskDao
    .scheduleInstitutionFreeTrialRemovalTask;

  addTask = this.taskDao.addTask;
}
