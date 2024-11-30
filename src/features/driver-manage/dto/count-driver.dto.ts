import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class CountDriverDto {
  @ApiProperty({})
  @IsBoolean()
  @IsOptional()
  isIdentityVerified: boolean;

  @ApiProperty({
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isAiChecked: boolean;

  @ApiProperty({
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isRejected: boolean;
}

export class CountDriverResponse {
  @ApiProperty({
    default: 0,
  })
  count: number;
}
