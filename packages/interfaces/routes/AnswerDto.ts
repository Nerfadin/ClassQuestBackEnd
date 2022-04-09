// usado internamente
export type AnswerDto = {
  id: string;
  answeredAt?: Date;
  score: number;
  total: number;
  acertos: number;
  erros: number;
  originalQuestId?: string;
  questId: string;
  groupId?: string;
} & Answers;

// vem do unity
export type SubmitAnswerDto = {
  id: string;
  questId: string;
} & Answers;

type Answers = {
  answers: {
    [questionId: string]: string | string[];
  };
};
