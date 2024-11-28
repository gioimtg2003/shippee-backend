import { JWT_TYPE_ENUM } from '@constants';
import { SetMetadata } from '@nestjs/common';

export const JWT_SECRET_TYPE = 'JwtSecretType';

export const JwtSecretType = (type: JWT_TYPE_ENUM) =>
  SetMetadata(JWT_SECRET_TYPE, type);
