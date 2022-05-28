"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const TaskFirestoreAdaptor_1 = require("./TaskFirestoreAdaptor");
const tsyringe_1 = require("../../utils/tsyringe");
let TaskService = class TaskService {
    constructor(taskDao) {
        this.taskDao = taskDao;
        this.scheduleFreeTrialRemovalTask = this.taskDao.scheduleFreeTrialRemovalTask;
        this.scheduleInstitutionFreeTrialRemovalTask = this.taskDao
            .scheduleInstitutionFreeTrialRemovalTask;
        this.addTask = this.taskDao.addTask;
    }
};
TaskService = __decorate([
    (0, tsyringe_1.Singleton)(),
    __param(0, (0, tsyringe_1.Inject)(() => TaskFirestoreAdaptor_1.TaskFirestoreAdaptor)),
    __metadata("design:paramtypes", [TaskFirestoreAdaptor_1.TaskFirestoreAdaptor])
], TaskService);
exports.TaskService = TaskService;
//# sourceMappingURL=TaskService.js.map