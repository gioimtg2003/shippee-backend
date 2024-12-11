import { LocationDto } from '@common/dto';
import { PickType } from '@nestjs/swagger';

export class DriverStatusInput extends PickType(LocationDto, ['lat', 'lng']) {}
