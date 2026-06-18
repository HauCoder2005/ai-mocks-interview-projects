import { AppRole } from '../enums/app-role.enum';

export interface AuthenticatedUser {
  id: number;
  email: string;
  role: AppRole;
}
