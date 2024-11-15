import { CreateAdminDto } from '@features/admin/dto/create-admin.dto';
import { PickType } from '@nestjs/swagger';

export class AdminLoginInput extends PickType(CreateAdminDto, [
  'username',
  'password',
] as const) {}
