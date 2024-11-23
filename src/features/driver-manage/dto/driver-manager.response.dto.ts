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

export class ResponseGetAllDriverDTO extends ResponseDTO<DataDriverResponse[]> {
  @ApiProperty({
    example: [
      {
        id: 1,
        createdAt: '2024-11-19T15:24:48.465Z',
        name: 'Cong Gioi',
        email: 'conggioi.pro264@gmail.com',
        phone: '0367039394  ',
        isIdentityVerified: false,
      },
      {
        id: 4,
        createdAt: '2024-11-19T15:25:18.054Z',
        name: 'Cong Gioi',
        email: 'conggioi.pro64@gmail.com',
        phone: '0367014394  ',
        isIdentityVerified: false,
      },
    ],
    type: [DataDriverResponse],
  })
  declare data: DataDriverResponse[];
}
