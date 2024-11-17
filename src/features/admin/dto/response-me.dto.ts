import { PickType } from '@nestjs/swagger';
import { UpdateAdminDto } from './update-admin.dto';

export class ResponseMeDTO extends PickType(UpdateAdminDto, [
  'id',
  'name',
  'username',
]) {}
