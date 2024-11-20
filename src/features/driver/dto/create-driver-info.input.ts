import { ResponseDTO } from '@common/dto';
import { LIMIT_NAME, LIMIT_URL_IMG } from '@constants';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
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
    description: 'Province',
    example: 'Quang Ngai',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(LIMIT_NAME)
  province: string;

  @ApiProperty({
    description: 'District',
    example: 'Binh Son',
  })
  @IsString()
  @MaxLength(LIMIT_NAME)
  @MinLength(1)
  district: string;

  @ApiProperty({
    description: 'Ward',
    example: 'Binh Hai',
  })
  @IsString()
  @MaxLength(LIMIT_NAME)
  @MinLength(1)
  ward: string;

  @ApiProperty({
    description: 'Identity card number',
    example: '123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  @MinLength(1)
  identityCardNumber: string;

  @ApiProperty({
    description: 'Image identity card front',
    example: '672ds-da9sdj-fas34-asd9', //uuid
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(LIMIT_URL_IMG)
  @MinLength(5)
  imgIdentityCardFront: string;

  @ApiProperty({
    description: 'Image identity card back',
    example: '672ds-da9sdj-fas34-asd9', //uuid
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(LIMIT_URL_IMG)
  @MinLength(5)
  imgIdentityCardBack: string;
}

export class ResponseCreateDriverInfoDTO extends ResponseDTO {
  @ApiProperty({
    example: {
      id: 1,
      idDriver: 1,
      province: 'Quang Ngai',
      district: 'Binh Son',
      ward: 'Binh Hai',
    },
    description: 'Data',
  })
  data: CreateDriverInfoInput;
}
