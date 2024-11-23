import { ResponseDTO } from '@common/dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { UpdateAdminDto } from './update-admin.dto';

class Data extends PickType(UpdateAdminDto, ['id', 'name', 'username']) {}

export class ResponseMeDTO extends ResponseDTO<Data> {
  @ApiProperty({
    description: 'Data',
    type: Data,
  })
  declare data: Data;
}
