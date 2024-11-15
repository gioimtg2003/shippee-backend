import { LIMIT_NAME } from '@constants';
import { IsPhoneNumber } from '@decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateDriverInput {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(LIMIT_NAME)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;
}
