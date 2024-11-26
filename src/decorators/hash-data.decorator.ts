import { SetMetadata } from '@nestjs/common';

export const HASH_FIELDS_KEY = 'hashFields';

export const HashFields = (...fields: string[]) =>
  SetMetadata(HASH_FIELDS_KEY, fields);
