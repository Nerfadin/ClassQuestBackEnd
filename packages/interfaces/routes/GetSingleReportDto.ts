import { QuestInGroupDto } from "../groups";
import { Player } from "../player";
import { AnswerDto } from "./AnswerDto";
export type GetSingleReportDto = {
  report: QuestInGroupDto;
  players: {
    answer: AnswerDto | null;
    player: Player | null;
  }[];
};
