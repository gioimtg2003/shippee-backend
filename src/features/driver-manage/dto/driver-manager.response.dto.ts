import { ResponseDTO } from '@common/dto';
import { CoreEntity } from '@common/entities';
import { CreateDriverInput } from '@features/driver/dto';
import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';

class DataDriverResponse extends IntersectionType(
  PickType(CreateDriverInput, ['name', 'phone', 'email', 'transportTypeId']),
  PickType(CoreEntity, ['createdAt']),
) {
  @ApiProperty({
    example: false,
    description: 'Driver is identity verified',
  })
  isIdentityVerified: boolean;
}

export class ResponseGetAllDriverDTO extends ResponseDTO {
  @ApiProperty({
    example: [
      {
        name: 'Cong Gioi',
        phone: '0123456789',
        email: 'abcxyz@gmail.com',
        createdAt: '2021-07-07T06:00:00.000Z',
      },
    ],
  })
  data: DataDriverResponse[];
}
