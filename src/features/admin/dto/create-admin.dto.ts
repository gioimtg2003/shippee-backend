import { LIMIT_NAME } from '@constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  @MaxLength(LIMIT_NAME)
  @ApiProperty({ description: 'Admin name', example: 'Nguyen Cong Gioi' })
  name: string;

  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(4)
  @ApiProperty({ description: 'Admin username', example: 'admin' })
  username: string;

  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(6)
  @ApiProperty({ description: 'Admin password', example: '123456' })
  password: string;
}
