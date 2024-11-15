import { LIMIT_NAME } from '@constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  @MaxLength(LIMIT_NAME)
  name: string;

  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(4)
  @ApiProperty({ example: 'admin' })
  username: string;

  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(6)
  @ApiProperty({ example: '******' })
  password: string;
}
