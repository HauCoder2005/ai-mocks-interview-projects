import type { Request } from 'express';
import type { AuthenticatedUser } from './authenticated-user.interface';

export type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};

export type RequestWithCookies = Request & {
  cookies: Record<string, string | undefined>;
};
