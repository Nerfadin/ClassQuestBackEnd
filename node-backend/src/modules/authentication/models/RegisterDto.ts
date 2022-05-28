export type RegisterDtoStepOne = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};
export type RegisterDtoStepTwo = {
  gender: string;
  playerName: string;
};

export type RegisterPayload = {
  localId: string;
  email: string;
  idToken: string;
  refreshToken: string;
  expiresIn: string; // "3600"
};
export interface AuthCustomClaims {
  userId: string;
  roles: InstitutionRoles[];
}
export interface InstitutionRoles {
  institutionId: string;
  role: string;
}