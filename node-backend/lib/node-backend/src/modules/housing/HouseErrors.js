"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HouseErrors = void 0;
const errorUtils_1 = require("../../utils/errorUtils");
class HouseErrors {
    static GetHouseError(err) {
        return new errorUtils_1.EntityNotFoundError({
            message: "Não foi possível encontrar a casa",
            type: "house_did_not_find",
            statusCode: 404,
            details: err,
        });
    }
    static HouseAlreadyExist() {
        return new errorUtils_1.BadRequestError({
            message: "Jogador já possui uma casa",
            type: "house_already_exist",
            statusCode: 400,
        });
    }
    static HouseCreateError(err) {
        return new errorUtils_1.BadRequestError({
            message: "Não foi possível criar a casa",
            type: "bad_request",
            statusCode: 400,
            details: err,
        });
    }
    static HouseTestError() {
        return new errorUtils_1.BadRequestError({
            message: "Voce deveria me tratar",
            type: "erro_falso",
            statusCode: 400,
        });
    }
}
exports.HouseErrors = HouseErrors;
//# sourceMappingURL=HouseErrors.js.map