"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageErrors = void 0;
const errorUtils_1 = require("../../utils/errorUtils");
class MessageErrors {
    static MessageNotFound(err) {
        return new errorUtils_1.EntityNotFoundError({
            message: "nenhuma mensagem no grupo.",
            type: "entity_not_found",
            statusCode: 404,
            details: err
        });
    }
    static MessageNotAvailable(err) {
        return new errorUtils_1.EntityNotFoundError({
            message: "Você não tem permissão para acessar as mensagens desse grupo.",
            type: "Unauthorized",
            statusCode: 401,
            details: err
        });
    }
    static MessageNotSend(err) {
        return new errorUtils_1.EntityNotFoundError({
            message: "Não foi possível enviar essa mensagem, tente novamente mais tarde ou entre em contato com o suporte.",
            type: "bad_request",
            statusCode: 400,
            details: err
        });
    }
}
exports.MessageErrors = MessageErrors;
//# sourceMappingURL=MessageErrors.js.map