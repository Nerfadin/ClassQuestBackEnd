"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskFirestoreAdaptor = exports.SCHEDULED_TASKS = void 0;
const app_1 = require("../../app");
const tsyringe_1 = require("../../utils/tsyringe");
exports.SCHEDULED_TASKS = "scheduled_tasks";
let TaskFirestoreAdaptor = class TaskFirestoreAdaptor {
    async scheduleFreeTrialRemovalTask(teacherSecurity) {
        // TODO: TeacherSecurity
        return await this.addTask({
            type: "remove_teachers_paid_plan",
            teacherId: teacherSecurity.id,
            dueDate: teacherSecurity.freeTrialEnd,
        });
    }
    async scheduleInstitutionFreeTrialRemovalTask(institutionSecurity // TODO: InstitutionSecurity
    ) {
        return await this.addTask({
            type: "remove_institutions_paid_plan",
            institutionId: institutionSecurity.id,
            dueDate: institutionSecurity.freeTrialEnd,
        });
    }
    async addTask(task) {
        // TODO: Omit<ScheduledTask, "id">
        return app_1.adminDb.collection(exports.SCHEDULED_TASKS).add(Object.assign({}, task));
    }
};
TaskFirestoreAdaptor = __decorate([
    tsyringe_1.Singleton()
], TaskFirestoreAdaptor);
exports.TaskFirestoreAdaptor = TaskFirestoreAdaptor;
//# sourceMappingURL=TaskFirestoreAdaptor.js.map