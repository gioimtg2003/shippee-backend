// login response dto

import { ResponseDTO } from '@common/dto';
import { ApiProperty } from '@nestjs/swagger';

class Data {
  @ApiProperty({
    description: 'JWT token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.4S5s2',
  })
  token: string;
}

export class LoginResponseDto extends ResponseDTO<Data> {
  @ApiProperty({
    description: 'Response data',
    example: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.4S5s2',
    },
  })
  @ApiProperty({
    type: Data,
  })
  declare data: Data;
}
