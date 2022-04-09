import { ApiError } from "../../../utils/errorUtils";

export class InvalidInvite extends ApiError {
    public message = "O professor parece já ter um convite pendente";
    public type = "invitatiuon_not_valid";
    public statusCode = 404;
  }