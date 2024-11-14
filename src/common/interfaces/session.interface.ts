import { Role } from '@constants';

export interface IUserSessionProps {
  id: number;
  name: string;
  email: string;
  role: Role;
  accessToken: string;
  refreshToken: string;
}
