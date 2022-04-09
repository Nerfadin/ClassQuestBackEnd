"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportMigrationFacade = exports.ANSWERS = exports.QUESTS = exports.PLAYERS = void 0;
const tsyringe_1 = require("../../utils/tsyringe");
const QuestService_1 = require("../../modules/quests/QuestService");
exports.PLAYERS = "players";
exports.QUESTS = "quests";
exports.ANSWERS = "answers";
let reportMigrationFacade = class reportMigrationFacade {
    CreateQuestReport(quest) {
        const questService = tsyringe_1.build(QuestService_1.QuestService);
        const report = questService.getReport(quest);
        console.log(report);
        return report;
    }
};
reportMigrationFacade = __decorate([
    tsyringe_1.Singleton()
], reportMigrationFacade);
exports.reportMigrationFacade = reportMigrationFacade;
//# sourceMappingURL=reportMigrationFacade.js.map