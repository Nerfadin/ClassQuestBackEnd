import { BadRequestError, EntityNotFoundError } from "../../utils/errorUtils";

export class HouseErrors {
    static GetHouseError(err: Error) {
        return new EntityNotFoundError({
            message: "Não foi possível encontrar a casa",
            type: "house_did_not_find",
            statusCode: 404,
            details: err,
        });
    }
    static HouseAlreadyExist() {
        return new BadRequestError({
            message: "Jogador já possui uma casa",
            type: "house_already_exist",
            statusCode: 400,
        });
    }
    static HouseCreateError(err: Error) {
        return new BadRequestError({
            message: "Não foi possível criar a casa",
            type: "bad_request",
            statusCode: 400,
            details: err,
        });
    }

    static HouseTestError() {
        return new BadRequestError({
            message: "Voce deveria me tratar",
            type: "erro_falso",
            statusCode: 400,
        });
    }
}