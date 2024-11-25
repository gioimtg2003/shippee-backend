import { TRANSPORT_TYPE_ENUM } from '@constants';
import { ApiProperty } from '@nestjs/swagger';

export class TransportTypeDTO {
  @ApiProperty({
    description: 'Transport type ID',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'Transport name',
    example: 'Xe máy',
  })
  name: string;

  @ApiProperty({
    description: 'Transport type image URL',
    example: 'https://media-shipppee.nguyenconggioi.me/moto_bike.png',
  })
  imageUrl: string;

  @ApiProperty({
    description: 'Transport type description',
    example: 'Hoạt động tất cả khung giờ, chở tối đa 100kg',
  })
  description: string;

  @ApiProperty({
    enum: TRANSPORT_TYPE_ENUM,
    description: 'Transport type code',
    example: TRANSPORT_TYPE_ENUM.BIKE,
  })
  code: TRANSPORT_TYPE_ENUM;

  @ApiProperty({
    description: 'Transport type load weight',
    example: 100000,
  })
  loadWeight: number;

  @ApiProperty({
    description: 'Transport type text weight',
    example: '100Kg',
  })
  textWeight: string;

  @ApiProperty({
    description: 'Transport type text size',
    example: '1 x 1 x 1 m',
  })
  textSize: string;
}
