import { Timestamp } from "../../../../packages/interfaces/quest";

export interface SubjectDto{
    subjectName: string;
    subjectSlug: string;
    subjectId: string;
    subjectYears: string[];
    createdAt:Timestamp;
    updatedAt: Timestamp;
}
export interface CreateSubjectDto{
    subjectName: string;
    subjectSlug: string;
    isMain: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;

}