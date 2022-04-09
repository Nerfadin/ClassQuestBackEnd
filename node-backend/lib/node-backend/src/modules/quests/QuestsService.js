"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQuestsService = exports.QuestsService = void 0;
const QuestsFirebaseAdaptor_1 = require("./QuestsFirebaseAdaptor");
const errorUtils_1 = require("../../utils/errorUtils");
class QuestsService {
    constructor(questsDao) {
        this.questsDao = questsDao;
    }
    findQuest(questId) {
        return this.questsDao
            .findQuest(questId)
            .mapLeft((err) => new errorUtils_1.EntityNotFoundError("Quest não encontrada"));
    }
    submitAnswer(answer, userId) {
        return this.questsDao
            .findAnswer(userId, answer.questId)
            .swap()
            .mapLeft((oldAnswer) => new errorUtils_1.BadRequestError("Usuário já respondeu essa quest", {
            answer: oldAnswer,
        }))
            .chain((_) => {
            return this.questsDao.submitAnswer(answer, userId);
        })
            .chain((_) => {
            return this.questsDao
                .findQuest(answer.questId)
                .mapLeft(() => new errorUtils_1.EntityNotFoundError("Quest não encontrada"));
        })
            .map((quest) => getUpdatedQuestStats(quest, answer))
            .chain((updatedQuestStats) => {
            return this.questsDao.updateQuest(answer.questId, updatedQuestStats);
        })
            .map(() => { });
    }
}
exports.QuestsService = QuestsService;
function buildQuestsService() {
    return new QuestsService(new QuestsFirebaseAdaptor_1.QuestsFirebaseAdaptor());
}
exports.buildQuestsService = buildQuestsService;
function getUpdatedQuestStats(quest, answer) {
    var _a, _b;
    const scorePercentage = answer.acertos / Object.keys(quest.questions).length;
    const studentsAnswerd = (_a = quest.studentsAnswered) !== null && _a !== void 0 ? _a : 0;
    const oldAvgScore = (_b = quest.averageScore) !== null && _b !== void 0 ? _b : 0;
    const newAvgScore = (studentsAnswerd * oldAvgScore + scorePercentage) / studentsAnswerd + 1;
    return Object.assign(Object.assign({}, quest), { averageScore: newAvgScore, studentsAnswered: studentsAnswerd + 1 });
}
//# sourceMappingURL=QuestsService.js.map