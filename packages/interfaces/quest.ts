export type CreateQuest = Omit<Quest, "id" | "createdAt">;
export interface Timestamp {
  seconds: number;
  nanoseconds: number;
  toDate(): Date;
}

export interface Quest {
  id: string;
  teacherId: string;
  institutionId: string;
  folderId: string;
  createdAt: Timestamp;
  title: string;
  groupsCount?: number;
  dataExpiracao: Timestamp | null;
  dificuldade: Difficulties;
  description?: string;
  materia?: string;
  bncc?: string;
  questions: Record<string, Question>;
  isPublished?: boolean;
}
export type QuestDto = Omit<Quest, "questions"> & {
  questions: QuestionDto[];
};
export type QuestionDto = Omit<Question, "content" | "answers"> & {
  id: string;
  content: QuestContentDto[];
  answers: AnswerDto[];
};

export interface AnswerDto extends Answer {
  id: string;
}
export interface QuestContentDto extends QuestionContentItem {
  id: string;
}

type BaseQuestion = {
  text: string;
  content?: Record<string, QuestionContentItem>;
};

export type MultipleChoiceQuestion = {
  type?: "multiple-choices";
  answers: Record<string, Answer>;
} & BaseQuestion;

export type SingleChoiceQuestion = {
  type: "single-choice";
  answers: Record<string, Answer>;
} & BaseQuestion;

export type ScaleQuestion = {
  type: "scale";
  min: number;
  max: number;
} & BaseQuestion;

// export type Text = {
//   type: "text";
//   content: string;
// };
// export type Video = {
//   type: "video";
//   url: string;
// };

// export type Image = {
//   type: "image";
//   url: string;
// };

export type Question =
  SingleChoiceQuestion | MultipleChoiceQuestion;

export type QuestionContentItem = {
  text?: string;
  url?: string;
  width?: number;
  height?: number;
  filetype?: string;
  size: number;
  type: "image" | "video" | "paragraph";
};

export interface Answer {
  text: string;
  isCorrect: boolean;
}

export enum Difficulties {
  Fácil = 0,
  Média = 1,
  Difícil = 2,
}
