import { ApiProperty } from '@nestjs/swagger';

export class ClientLoginResponseDto {
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
