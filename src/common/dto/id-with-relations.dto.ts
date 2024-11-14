import { IsNotEmpty, IsNumber } from 'class-validator';
import { RelationsArgs } from './relations.dto';

export class IdWithRelationsArgs extends RelationsArgs {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
