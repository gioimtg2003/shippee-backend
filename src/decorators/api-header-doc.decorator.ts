import { applyDecorators } from '@nestjs/common';
import { ApiHeaders } from '@nestjs/swagger';

export function ApiHashHeaders() {
  return applyDecorators(
    ApiHeaders([
      {
        name: 'x-shipppee-timestamp',
        description: 'Request timestamp',
        required: true,
        example: new Date().toISOString(),
      },
      {
        name: 'x-shipppee-sha-256',
        description: 'SHA-256 hash of the request',
        required: true,
        example:
          '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      },
    ]),
  );
}
