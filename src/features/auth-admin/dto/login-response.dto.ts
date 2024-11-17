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

  @ApiProperty({
    description: 'User ID',
    example: '12',
  })
  id: number;

  @ApiProperty({
    description: 'User name',
    example: 'Nguyen Cong Gioi',
  })
  name: string;
}

export class LoginResponseDto extends ResponseDTO<Data> {
  @ApiProperty({
    description: 'Response data',
    type: Data,
  })
  data: Data;
  constructor(token: string, id: number, name: string) {
    super();
    this.data = { token, id, name };
  }
}
