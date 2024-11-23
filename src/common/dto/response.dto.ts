import { ApiProperty } from '@nestjs/swagger';

export class ResponseDTO<T> {
  @ApiProperty({
    example: 200,
    description: 'status code',
  })
  code: number;

  @ApiProperty({
    example: true,
    description: 'status',
  })
  success: boolean;

  @ApiProperty({
    example: 'success',
    description: 'message',
  })
  message: string;

  data?: T;

  @ApiProperty({
    example: '2021-09-01T14:00:00.000Z',
    description: 'timestamp',
  })
  timestamp: string;
}
