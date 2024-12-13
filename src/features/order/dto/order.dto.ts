import { LocationDto } from '@common/dto';
import { SPECIAL_REQUIRE_ENUM } from '@constants';
import { IsLaterThan, IsPhoneNumber } from '@decorators';
import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsSpecialRequireItem } from 'src/decorators/special-require-item.decoractor';

export class CreateOrderInput {
  @IsObject()
  @IsNotEmpty()
  cod: CODDto;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'ID of the customer who placed the order',
  })
  idCustomer: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the customer who placed the order',
  })
  cusName: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: '0901234567',
    description: 'Phone number of the customer who placed the order',
  })
  cusPhone: string;

  @IsObject()
  @IsNotEmpty()
  pickup: LocationOrderDto;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Jane Doe',
    description: 'Name of the recipient',
  })
  recipientName: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: '0901234567',
    description: 'Phone number of the recipient',
  })
  recipientPhone: string;

  @IsObject()
  @IsNotEmpty()
  destination: LocationOrderDto;

  @IsBoolean()
  @IsNotEmpty()
  isDeliveryCharge: boolean;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    example: '2022-12-31T23:59:59Z',
    description: 'Start time of the delivery window',
  })
  startTime?: string;

  @IsDate()
  @IsLaterThan('startTime')
  @IsOptional()
  @ApiProperty({
    example: '2022-12-31T23:59:59Z',
    description: 'End time of the delivery window',
  })
  endTime?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'This is a note',
    description: 'Additional notes for the order',
  })
  note?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'ID of the transport type',
  })
  idTransportType: number;

  @IsSpecialRequireItem('Special Require Item', { each: true })
  @IsArray()
  @IsOptional()
  specialRequireItemPrice?: SPECIAL_REQUIRE_ENUM[];
}

class CODDto {
  @IsBoolean()
  @IsNotEmpty()
  isCOD: boolean;

  @IsNumber()
  @IsOptional()
  CODAmount?: number;
}

class LocationOrderDto extends PickType(LocationDto, ['lat', 'lng']) {
  @IsString()
  @IsNotEmpty()
  address: string;
}
