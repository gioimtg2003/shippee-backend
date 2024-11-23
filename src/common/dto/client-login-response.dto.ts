import { ApiProperty } from '@nestjs/swagger';
import { ResponseDTO } from './response.dto';

class Data {
  @ApiProperty({
    description: 'Access token',
    example: '',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token',
    example: '',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Token expiration time',
    example: '',
  })
  expiresIn: number;
}

export class ClientLoginResponseDto extends ResponseDTO {
  @ApiProperty({
    description: 'Response data',
    type: Data,
  })
  data: Data;
}
