import { Quest, QuestDto } from "./quest";

export interface Group {
  name: string;
  id: string;
  subject: string[];
  description: string;
  pin: string;
  schoolYear?: string;
  players: string[];
  playersCount: number;
  questsCount: number;
  studentsAnswered: number;
  averageScore: number;
  teacherId: string;
  messages?: string[]
  
}
export type CreateGroup = Omit<Group, "id" | "pin">;
export type QuestInGroup = Quest & {
  originalQuestId: string;
  studentsAnswered: number;
  averageScore: number;
  pin: string;
  groupId: string;
  players: string[];  
};
export type QuestInGroupDto = Omit<QuestInGroup, "questions"> &
  QuestDto & {
    isCompleted?: boolean;
  };
export type UpdateGroupQuest = Partial<Omit<QuestInGroup, "id">>;
