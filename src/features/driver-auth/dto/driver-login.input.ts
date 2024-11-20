import { CreateDriverInput } from '@features/driver/dto';
import { PickType } from '@nestjs/swagger';

export class DriverLoginInput extends PickType(CreateDriverInput, [
  'phone',
  'password',
]) {}
