import { BadRequestError, EntityNotFoundError } from "../../utils/errorUtils";

export class QuestErrors {
  static QuestExpired(data: Date) {
    return new BadRequestError({
      type: "quest_expired",
      message: "Quest expirada",
      details: {
        expirationDate: data,
      },
    });
  }

  static UserAlreadyAnswered(oldAnswer: any) {
    return new BadRequestError({
      type: "user_already_answered_quest",
      message: "Usuário já respondeu essa quest",
      details: {
        answer: oldAnswer,
      },
    });
  }
  static QuestNotFound(err: Error) {
    return new EntityNotFoundError({
      message: "Quest não encontrada",
      type: "quest_not_found",
      details: err,
    });
  }
}
