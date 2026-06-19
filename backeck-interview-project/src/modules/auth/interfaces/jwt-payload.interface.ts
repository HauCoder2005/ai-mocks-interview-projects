import { AppRole } from '../enums/app-role.enum';
import { AuthTokenType } from '../enums/auth-token-type.enum';

export interface JwtPayload {
  sub: number;
  email: string;
  role: AppRole;
  type: AuthTokenType;
  jti: string;
}
