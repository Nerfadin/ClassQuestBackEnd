"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectErrors = void 0;
const errorUtils_1 = require("../../utils/errorUtils");
class SubjectErrors {
    static SubjectNotFoundError(err) {
        return new errorUtils_1.EntityNotFoundError({
            message: "Não foi possível encontrar essa matéria.",
            type: "entity_not_found",
            statusCode: 404,
            details: err
        });
    }
    static SubjectAlreadyExistsError(message) {
        return new errorUtils_1.EntityNotFoundError({
            message: message,
            type: "CONFLICT_ententity_already_exists",
            statusCode: 409,
        });
    }
    static MessageNotSend(err) {
        return new errorUtils_1.EntityNotFoundError({
            message: "Não foi possível criar essa matéria, tente novamente mais tarde ou entre em contato com o suporte.",
            type: "bad_request",
            statusCode: 500,
            details: err
        });
    }
}
exports.SubjectErrors = SubjectErrors;
//# sourceMappingURL=SubjectErrors.js.map