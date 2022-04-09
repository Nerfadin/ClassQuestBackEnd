import { BadRequestError, EntityNotFoundError } from "../../utils/errorUtils";

export class HouseErrors {
    static GetHouseError(err: Error) {
        return new EntityNotFoundError({
            message: "Não foi possível encontrar a casa",
            type: "house_not_find",
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
            type: "Bad_Request",
            statusCode: 400,
            details: err,
        });
    }

    static HouseTestError() {
        return new BadRequestError({
            message: "Algo inesperado aconteceu, por favor tente novamente mais tarde",
            type: "Bad_Request",
            statusCode: 400,
        });
    }
}