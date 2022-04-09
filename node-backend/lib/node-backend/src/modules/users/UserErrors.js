"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserErrors = void 0;
const errorUtils_1 = require("../../utils/errorUtils");
class UserErrors {
    static UserNotFoundError(details) {
        return new errorUtils_1.EntityNotFoundError({
            type: "user_not_found",
            message: "Nenhum jogador encontrado",
            details: details,
        });
    }
    static TeacherNotFoundError(details) {
        return new errorUtils_1.EntityNotFoundError({
            message: "Nenhum professor encontrado",
            type: "teacher_not_found",
            details: details,
        });
    }
    static UserStatsNotFoundError(details) {
        return new errorUtils_1.EntityNotFoundError({
            type: "user_stats_not_found",
            details,
        });
    }
    static FailedToSavePlayer(details) {
        return new errorUtils_1.UnexpectedError({
            type: "save_player_failed",
            message: "Erro ao salvar dados",
            details,
        });
    }
}
exports.UserErrors = UserErrors;
//# sourceMappingURL=UserErrors.js.map