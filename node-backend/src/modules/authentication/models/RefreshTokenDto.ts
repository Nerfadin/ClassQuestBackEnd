export type RefreshTokenDto = {
  refreshToken: string;
};

export type RefreshTokenPayload = {
  expiresIn: string;
  tokenType: "Bearer";
  refreshToken: string;
  idToken: string;
  userId: string;
  projectId: string;
};
