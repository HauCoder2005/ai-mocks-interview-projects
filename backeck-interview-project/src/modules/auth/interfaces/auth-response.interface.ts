import { AppRole } from '../enums/app-role.enum';

export interface AuthUserResponse {
  id: number;
  email: string;
  fullName: string;
  role: AppRole;
  isVerified: boolean;
}

export interface AuthTokenResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: AuthUserResponse;
}

export interface MessageResponse {
  message: string;
}
