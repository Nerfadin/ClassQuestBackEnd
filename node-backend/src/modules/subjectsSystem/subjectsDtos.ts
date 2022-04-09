import { Timestamp } from "../../../../packages/interfaces/quest";

export interface ISubjectDto{
    subjectName: string;
    subjectSlug: string;
    subjectId: string;
    subjectYears: string[];
    createdAt:Timestamp;
    updatedAt: Timestamp;
}