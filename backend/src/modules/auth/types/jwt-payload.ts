import { UserRole } from '../../users/schemas/user.schema';

export type { UserRole };

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
