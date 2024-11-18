import { ResponseDTO } from '@common/dto';
import { LIMIT_NAME } from '@constants';
import { IsPhoneNumber } from '@decorators';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateDriverInput {
  @ApiProperty({
    description: 'Driver name',
    example: 'Cong Gioi',
  })
  @IsNotEmpty()
  @MaxLength(LIMIT_NAME)
  name: string;

  @ApiProperty({
    description: 'Driver email',
    example: 'conggioi.pro264@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Driver password',
    example: '123456',
  })
  @IsNotEmpty()
  @MaxLength(255)
  password: string;

  @ApiProperty({
    description: 'Driver phone number',
    example: '0123456789',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    description: 'Transport type ID',
    example: '1',
  })
  @IsNotEmpty()
  @Min(1)
  @Max(99)
  transportTypeId: number;
}

export class ResponseCreateDriverDTO extends ResponseDTO {
  @ApiProperty({
    example: true,
  })
  data: boolean;
}
