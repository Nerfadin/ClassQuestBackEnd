import { EntityNotFoundError } from "../../utils/errorUtils";

export class MessageErrors {
  static MessageNotFound(err: Error) {
    return new EntityNotFoundError({
      message: "nenhuma mensagem no grupo.",
      type: "entity_not_found",
      statusCode: 404,
      details: err
    });
  }
  static MessageNotAvailable(err: Error) {
    return new EntityNotFoundError({
      message: "Você não tem permissão para acessar as mensagens desse grupo.",
      type: "Unauthorized",
      statusCode: 401,
      details: err
    });
  }
  static MessageNotSend(err: Error) {
    return new EntityNotFoundError({
      message: "Não foi possível enviar essa mensagem, tente novamente mais tarde ou entre em contato com o suporte.",
      type: "bad_request",
      statusCode:  400,
      details: err
    });
  }
}