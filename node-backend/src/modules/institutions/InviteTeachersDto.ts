import { Timestamp } from "@interfaces/quest";
import { IsNotEmpty } from "class-validator";
export class InviteTeachersDto {
  @IsNotEmpty()
  directorId: string;
  @IsNotEmpty()
  institutionId: string;
  teacher: {
    name: string
    email: string
  }
  teacherId: string
  invitedDate: Timestamp
  invitationStatus: InvitationStatus  
}
export type InvitationStatus = "pending" | "accepted"