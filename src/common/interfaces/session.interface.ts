import { Role } from '@constants';

export interface IUserSessionProps {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface IDriverSessionProps {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone: string;
  isAiChecked: boolean;
  isIdentityVerified: boolean;
}
