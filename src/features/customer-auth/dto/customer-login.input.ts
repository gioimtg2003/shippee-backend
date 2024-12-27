import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CustomerLoginInput {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: 'conggioi@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(6, {
    message: 'Password is too short',
  })
  @ApiProperty({
    required: true,
    example: '********',
  })
  password: string;
}
