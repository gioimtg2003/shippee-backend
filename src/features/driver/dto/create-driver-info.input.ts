import { ResponseDTO } from '@common/dto';
import { LIMIT_NAME, LIMIT_NUMBER_ID } from '@constants';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
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
  @Length(LIMIT_NUMBER_ID, LIMIT_NUMBER_ID)
  identityCardNumber?: string;

  @ApiProperty({
    description: 'license plates',
    example: '76C193934',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  licensePlates?: string;

  @ApiProperty({
    description: 'List of images',
    example: '[]', //uuid
    required: false,
  })
  @IsOptional()
  @IsArray()
  @MaxLength(6)
  images?: string[];
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
