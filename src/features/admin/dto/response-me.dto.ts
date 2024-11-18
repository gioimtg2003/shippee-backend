import { ResponseDTO } from '@common/dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { UpdateAdminDto } from './update-admin.dto';

class Data extends PickType(UpdateAdminDto, ['id', 'name', 'username']) {}

export class ResponseMeDTO extends ResponseDTO {
  @ApiProperty({
    example: {
      id: 1,
      name: 'Cong Gioi',
      username: 'conggioi',
    },
    description: 'Data',
  })
  data: Data;
}
