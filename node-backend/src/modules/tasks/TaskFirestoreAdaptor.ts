import { adminDb } from "../../app";
import { Singleton } from "../../utils/tsyringe";

export const SCHEDULED_TASKS = "scheduled_tasks";
@Singleton()
export class TaskFirestoreAdaptor {
  async scheduleFreeTrialRemovalTask(teacherSecurity: any) {
    // TODO: TeacherSecurity
    return await this.addTask({
      type: "remove_teachers_paid_plan",
      teacherId: teacherSecurity.id,
      dueDate: teacherSecurity.freeTrialEnd,
    });
  }
  async scheduleInstitutionFreeTrialRemovalTask(
    institutionSecurity: any // TODO: InstitutionSecurity
  ) {
    return await this.addTask({
      type: "remove_institutions_paid_plan",
      institutionId: institutionSecurity.id,
      dueDate: institutionSecurity.freeTrialEnd,
    });
  }
  async addTask(task: any) {
    // TODO: Omit<ScheduledTask, "id">
    return adminDb.collection(SCHEDULED_TASKS).add({ ...task });
  }
}
