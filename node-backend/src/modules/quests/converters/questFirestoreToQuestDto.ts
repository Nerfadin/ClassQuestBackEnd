import { Quest, QuestDto } from "../../../../../packages/interfaces/quest";
import {
  QuestInGroup,
  QuestInGroupDto,
} from "../../../../../packages/interfaces/groups";

export function questFirestoreToQuestDto(quest: Quest): QuestDto {
  const questDto: QuestDto = {
    ...quest,
    questions: Object.entries(quest.questions).map(([id, question]) => ({
      ...question,
      id,
      content: Object.entries(question.content ?? {}).map(
        ([contentId, content]) => ({
          ...content,
          id: contentId,
        })
      ),
      answers: Object.entries(question.answers).map(([answerId, answer]) => ({
        ...answer,
        id: answerId,
      })),
    })),
  };
  return questDto;
}

export function questInGroupFirestoreToQuestInGroupDto(
  quest: QuestInGroup
): QuestInGroupDto {
  const questInGroup: QuestInGroupDto = {
    ...quest,
    ...questFirestoreToQuestDto(quest),
  };
  return questInGroup;
}
