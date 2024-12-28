import { LIMIT_NAME, LIMIT_PHONE } from '@constants';
import { IsPhoneNumber } from '@decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateCustomerInput {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @MaxLength(LIMIT_NAME)
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty()
  password: string;

  @IsOptional()
  @IsPhoneNumber()
  @MaxLength(LIMIT_PHONE)
  @ApiProperty()
  phone: string;

  @IsOptional()
  @MaxLength(LIMIT_NAME)
  @ApiProperty()
  province: string;

  @IsOptional()
  @MaxLength(LIMIT_NAME)
  @ApiProperty()
  district: string;

  @IsOptional()
  @MaxLength(LIMIT_NAME)
  @ApiProperty()
  ward: string;

  @IsOptional()
  @MaxLength(LIMIT_NAME)
  @ApiProperty()
  address: string;

  @IsOptional()
  @ApiProperty()
  timeOtp: Date;

  @IsOptional()
  @ApiProperty()
  otp: string;
}
