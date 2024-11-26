import { LIMIT_NUMBER_ID, LIMIT_URL_IMG } from '@constants';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateDriverInfoInput {
  @ApiProperty({
    description: 'Driver ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Max(9999)
  @Min(1)
  idDriver: number;

  @ApiProperty({
    description: 'Identity card number',
    example: '123456789',
    required: true,
  })
  @IsOptional()
  @IsString()
  @Length(LIMIT_NUMBER_ID, LIMIT_NUMBER_ID)
  identityCardNumber: string;

  @ApiProperty({
    description: 'Image identity card front',
    example: '672ds-da9sdj-fas34-asd9', //uuid
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(LIMIT_URL_IMG)
  @MinLength(5)
  imgIdentityCardFront: string;

  @ApiProperty({
    description: 'Image identity card back',
    example: '672ds-da9sdj-fas34-asd9', //uuid
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(LIMIT_URL_IMG)
  @MinLength(5)
  imgIdentityCardBack: string;
}
