import { LIMIT_NUMBER_ID, LIMIT_URL_IMG } from '@constants';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateDriverInfoInput {
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
  @IsOptional()
  @IsString()
  @MaxLength(LIMIT_URL_IMG)
  @MinLength(5)
  imgIdentityCardFront: string;

  @ApiProperty({
    description: 'Image identity card back',
    example: '672ds-da9sdj-fas34-asd9', //uuid
    required: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(LIMIT_URL_IMG)
  @MinLength(5)
  imgIdentityCardBack: string;

  @ApiProperty({
    description: 'Identity card number',
    example: '123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(LIMIT_NUMBER_ID, LIMIT_NUMBER_ID)
  driverLicenseNumber?: string;

  @ApiProperty({
    description: 'Image Driver License front',
    example: '672ds-da9sdj-fas34-asd9', //uuid
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(LIMIT_URL_IMG)
  @MinLength(5)
  imgDriverLicenseFront?: string;

  @ApiProperty({
    description: 'Image Driver License back',
    example: '672ds-da9sdj-fas34-asd9', //uuid
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(LIMIT_URL_IMG)
  @MinLength(5)
  imgDriverLicenseBack?: string;

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
    description: 'Image Vehicle Registration Cert Front',
    example: '672ds-da9sdj-fas34-asd9', //uuid
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(LIMIT_URL_IMG)
  @MinLength(5)
  imgVehicleRegistrationCertFront?: string;

  @ApiProperty({
    description: 'Image Vehicle Registration Cert Back',
    example: '672ds-da9sdj-fas34-asd9', //uuid
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(LIMIT_URL_IMG)
  @MinLength(5)
  imgVehicleRegistrationCertBack?: string;
}
