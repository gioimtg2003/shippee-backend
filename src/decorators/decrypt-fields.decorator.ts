import { SetMetadata } from '@nestjs/common';

export const DECRYPT_FIELDS_KEY = 'hashFields';

export const DecryptFields = <T>(...fields: Array<keyof T>) =>
  SetMetadata(DECRYPT_FIELDS_KEY, fields);
