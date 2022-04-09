export type LoginDto = { email?: string; password?: string };
export type LoginPayload = {
    localId: string;
    email: string;
    displayName: string;
    idToken: string;
    registered: boolean;
    refreshToken: string;
    expiresIn: string; // "3600"
    deviceId: string;
    
  };
  