import { Answer } from "@interfaces/quest";

export interface AnswredQuestDTO {
    title: string;
    answers : Answer[];
    questid: string;

}