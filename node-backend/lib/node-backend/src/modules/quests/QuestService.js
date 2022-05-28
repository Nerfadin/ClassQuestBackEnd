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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestService = void 0;
const QuestFirebaseAdaptor_1 = require("./QuestFirebaseAdaptor");
const errorUtils_1 = require("../../utils/errorUtils");
const UserService_1 = require("../users/UserService");
const tsyringe_1 = require("../../utils/tsyringe");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const GroupService_1 = require("../groups/GroupService");
const dayjs_1 = __importDefault(require("dayjs"));
const QuestErrors_1 = require("./QuestErrors");
const arr_1 = require("../../utils/arr");
const orUndefined_1 = require("../../utils/orUndefined");
let QuestService = class QuestService {
    constructor(questsDao, userService, groupService) {
        this.questsDao = questsDao;
        this.userService = userService;
        this.groupService = groupService;
    }
    RemoveEmptyFromArray(arr) {
        return arr.filter(obj => !(obj && Object.keys(obj).length === 0));
    }
    async getReports(teacherId) {
        const reports = await this.questsDao.getPublishedQuests(teacherId);
        const groups = await this.groupService.getGroupsIgnoreNotFound(reports.map((r) => r.groupId));
        return reports.map((report, i) => (Object.assign(Object.assign({}, report), { group: groups[i] })));
    }
    async getReport(questId) {
        var _a;
        const quest = await this.getQuest(questId);
        const playerIds = (_a = quest.players) !== null && _a !== void 0 ? _a : [];
        /*let queriedReports = [] as GetSingleReportDto[];
        const reports = await playerIds.map(async (playerId) => {
          const playerAndAnswers = await this.getPlayerAndAnswer(playerId, questId);
          const report = {
            players: {
              player: playerAndAnswers.player,
              answer: playerAndAnswers.answer
            }
          } as unknown as GetSingleReportDto;
          queriedReports.push(report);
          return report;
        });
    
        const reportsPromisse = await Promise.all(reports)
        const finalReport = {
          report: quest,
            players: {
            ...reportsPromisse
          }
        }
        return finalReport;
        */
        const playersAndAnswers = await Promise.all(playerIds.map((playerId) => this.getPlayerAndAnswer(playerId, questId)));
        playersAndAnswers.filter((value) => Object.keys(value).length !== 0);
        return {
            report: quest,
            players: this.RemoveEmptyFromArray(playersAndAnswers),
        };
    }
    async getPlayerAndAnswer(playerId, questId) {
        try {
            const [player, answer] = ([
                await this.userService.getPlayer(playerId),
                await this.questsDao.getAnswer(playerId, questId),
            ]);
            return {
                player,
                answer,
            };
        }
        catch (_a) {
            return {};
        }
    }
    getQuest(questId) {
        return this.questsDao.getQuest(questId).catch((err) => {
            throw err instanceof errorUtils_1.EntityNotFoundError
                ? QuestErrors_1.QuestErrors.QuestNotFound(err)
                : err;
        });
    }
    async submitAnswer(answer, userId) {
        // if previously answered quest, throw error
        const previousAnswer = await (0, orUndefined_1.orUndefined)(this.questsDao.getAnswer(userId, answer.questId));
        if (previousAnswer) {
            throw QuestErrors_1.QuestErrors.UserAlreadyAnswered(previousAnswer);
        }
        const quest = await this.questsDao.getQuest(answer.questId);
        if (quest.dataExpiracao &&
            (0, dayjs_1.default)(quest.dataExpiracao.toDate()).isBefore(new Date())) {
            throw QuestErrors_1.QuestErrors.QuestExpired(quest.dataExpiracao.toDate());
        }
        const group = await this.groupService.getGroup(quest.groupId);
        await this.groupService.addStudentToGroup(userId, group.id, quest.teacherId);
        const studentsAnswered = quest.studentsAnswered + 1;
        await this.userService.incrementTeachersScore(quest.teacherId, {
            points: studentsAnswered === 5 ? 6 : 5,
            publishedActivitiesCount: studentsAnswered === 5 ? 1 : 0,
            studentsCompletedActivityCount: 1,
        });
        const score = getScore(quest, answer);
        await this.questsDao.saveAnswer(score, userId);
        const questStats = getUpdatedQuestStats(quest, score);
        const groupStats = getUpdatedGroupStats(group, score.score);
        await this.questsDao.updateQuestInGroup(answer.questId, Object.assign(Object.assign({}, questStats), { players: firebase_admin_1.default.firestore.FieldValue.arrayUnion(userId) }));
        await this.groupService.updateGroup(group.id, groupStats);
        await this.userService.savePlayerStats(userId, {
            completedQuests: {
                [quest.id]: true,
            },
            completedQuestsCount: firebase_admin_1.default.firestore.FieldValue.increment(1),
        });
    }
};
QuestService = __decorate([
    (0, tsyringe_1.Singleton)(),
    __param(0, (0, tsyringe_1.Inject)(() => QuestFirebaseAdaptor_1.QuestFirebaseAdaptor)),
    __param(1, (0, tsyringe_1.Inject)(() => UserService_1.UserService)),
    __param(2, (0, tsyringe_1.Inject)(() => GroupService_1.GroupService)),
    __metadata("design:paramtypes", [QuestFirebaseAdaptor_1.QuestFirebaseAdaptor,
        UserService_1.UserService,
        GroupService_1.GroupService])
], QuestService);
exports.QuestService = QuestService;
function getUpdatedQuestStats(quest, answer) {
    var _a, _b;
    const questionsCount = Object.keys(quest.questions).length;
    const scorePercentage = answer.acertos / questionsCount;
    const studentsAnswerd = (_a = quest.studentsAnswered) !== null && _a !== void 0 ? _a : 0;
    const oldAvgScore = (_b = quest.averageScore) !== null && _b !== void 0 ? _b : 0;
    const newAvgScore = (studentsAnswerd * oldAvgScore + scorePercentage) / (studentsAnswerd + 1);
    return Object.assign(Object.assign({}, quest), { averageScore: newAvgScore, studentsAnswered: studentsAnswerd + 1 });
}
function getUpdatedGroupStats(group, score) {
    var _a, _b;
    const scorePercentage = score;
    const studentsAnswerd = (_a = group.studentsAnswered) !== null && _a !== void 0 ? _a : 0;
    const oldAvgScore = (_b = group.averageScore) !== null && _b !== void 0 ? _b : 0;
    const newAvgScore = (studentsAnswerd * oldAvgScore + scorePercentage) / (studentsAnswerd + 1);
    return Object.assign(Object.assign({}, group), { averageScore: newAvgScore, studentsAnswered: studentsAnswerd + 1 });
}
function getScore(quest, answer) {
    const total = Object.keys(quest.questions).length;
    let acertos = 0;
    let erros = 0;
    // tslint:disable-next-line:forin
    for (const questionId in quest.questions) {
        const question = quest.questions[questionId];
        const answeredId = answer.answers[questionId];
        const didGetCorrect = question.type === "multiple-choices"
            ? didGetMultipleAnswerQuestionCorrect(question, answeredId)
            : didGetSingleAnswerQuestionCorrect(question, answeredId);
        if (didGetCorrect) {
            acertos++;
        }
        else {
            erros++;
        }
    }
    return Object.assign(Object.assign({}, answer), { answeredAt: new Date(), acertos,
        erros,
        total, score: acertos / total });
}
function didGetMultipleAnswerQuestionCorrect(question, answers) {
    const studentAnswers = Array.isArray(answers) ? answers : [answers];
    // only true if he gets ALL of the answers right, and NONE of the answers wrong
    const correctAnswers = question.answers
        .filter((a) => a.isCorrect)
        .map((a) => a.id);
    const incorrectAnswers = question.answers
        .filter((a) => !a.isCorrect)
        .map((a) => a.id);
    if ((0, arr_1.includesAny)(studentAnswers, incorrectAnswers)) {
        return false;
    }
    if ((0, arr_1.includesAll)(studentAnswers, correctAnswers)) {
        return true;
    }
    return false;
}
function didGetSingleAnswerQuestionCorrect(question, answeredId) {
    if (typeof answeredId == "string") {
        const didGetCorrect = question.answers.find((a) => a.isCorrect && a.id === answeredId);
        return !!didGetCorrect;
    }
    return false;
}
//# sourceMappingURL=QuestService.js.map