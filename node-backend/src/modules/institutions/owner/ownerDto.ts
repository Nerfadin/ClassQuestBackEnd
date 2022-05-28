import { Timestamp } from "@interfaces/quest";

export interface CreateOwnerDto {
    ownerName: string;
    ownerPlan: string;
    ownerBillingDate: Timestamp;
    CreatedAt: Timestamp;
    Adress: { 
        street: string;
        number: number;
        city: string;
        state: string;
    }
}
export interface updateOwnedStatistics {
    questCountAdd: number;
    teacherCountAdd: number;
    playerCountAdd: number;    
}