"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestErrors = void 0;
const errorUtils_1 = require("../../utils/errorUtils");
class QuestErrors {
    static QuestExpired(data) {
        return new errorUtils_1.BadRequestError({
            type: "quest_expired",
            message: "Quest expirada",
            details: {
                expirationDate: data,
            },
        });
    }
    static UserAlreadyAnswered(oldAnswer) {
        return new errorUtils_1.BadRequestError({
            type: "user_already_answered_quest",
            message: "Usuário já respondeu essa quest",
            details: {
                answer: oldAnswer,
            },
        });
    }
    static QuestNotFound(err) {
        return new errorUtils_1.EntityNotFoundError({
            message: "Quest não encontrada",
            type: "quest_not_found",
            details: err,
        });
    }
}
exports.QuestErrors = QuestErrors;
//# sourceMappingURL=QuestErrors.js.map