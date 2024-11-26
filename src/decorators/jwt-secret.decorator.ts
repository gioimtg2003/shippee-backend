import { SetMetadata } from '@nestjs/common';

export const JWT_SECRET_TYPE = 'JwtSecretType';
export type JWT_SECRET_TYPE = 'access' | 'refresh' | 'verify';
export const JwtSecretType = (type: 'access' | 'refresh' | 'verify') =>
  SetMetadata(JWT_SECRET_TYPE, type);
