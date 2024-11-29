import { ApiProperty } from '@nestjs/swagger';

export class CountDriverDto {
  @ApiProperty({})
  isIdentityVerified: boolean;

  @ApiProperty({
    default: false,
  })
  isAiChecked: boolean;
}

export class CountDriverResponse {
  @ApiProperty({
    default: 0,
  })
  count: number;
}
