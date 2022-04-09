import { EntityNotFoundError, UnexpectedError } from "../../utils/errorUtils";

export class UserErrors {
  static UserNotFoundError(details: any) {
    return new EntityNotFoundError({
      type: "user_not_found",
      message: "Nenhum jogador encontrado",
      details: details,
    });
  }
  static TeacherNotFoundError(details: any) {
    return new EntityNotFoundError({
      message: "Nenhum professor encontrado",
      type: "teacher_not_found",
      details: details,
    });
  }
  static UserStatsNotFoundError(details: any) {
    return new EntityNotFoundError({
      type: "user_stats_not_found",
      details,
    });
  }
  static FailedToSavePlayer(details: any) {
    return new UnexpectedError({
      type: "save_player_failed",
      message: "Erro ao salvar dados",
      details,
    });
  }
}
