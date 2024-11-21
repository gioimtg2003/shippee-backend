import { PickType } from '@nestjs/mapped-types';
import { CreateDriverInput } from '../dto';

class Props extends PickType(CreateDriverInput, [
  'name',
  'email',
  'phone',
  'password',
]) {}

export class DriverCreateEvent {
  constructor(public driver: Props) {}
}
