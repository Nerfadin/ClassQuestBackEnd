import { EntityNotFoundError } from "../../utils/errorUtils";

export class SubjectErrors {
  static SubjectNotFoundError(err: Error) {
    return new EntityNotFoundError({
      message: "Não foi possível encontrar essa matéria.",
      type: "entity_not_found",
      statusCode: 404,
      details: err
    });
  }  
  static SubjectAlreadyExistsError(message: string) {
    return new EntityNotFoundError({
      message:message,
      type: "CONFLICT_ententity_already_exists",
      statusCode: 409,
    });
  }
  static MessageNotSend(err: Error) {
    return new EntityNotFoundError({
      message: "Não foi possível criar essa matéria, tente novamente mais tarde ou entre em contato com o suporte.",
      type: "bad_request",
      statusCode: 500,
      details: err
    });
  }
}