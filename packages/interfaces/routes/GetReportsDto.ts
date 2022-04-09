import {
  QuestInGroupDto,
  Group,
} from "../groups";

export type GetReportsDto = (QuestInGroupDto & { group: Group })[];
