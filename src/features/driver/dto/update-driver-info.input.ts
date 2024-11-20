import { PartialType } from '@nestjs/swagger';
import { CreateDriverInfoInput } from './create-driver-info.input';

export class UpdateDriverInfoInput extends PartialType(CreateDriverInfoInput) {}
