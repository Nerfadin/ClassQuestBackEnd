import { Timestamp } from "@interfaces/quest";
export interface ILogDto {
    functionName: string;
    userId: string;
    body: string;    
    Timestamp: Timestamp;    
}