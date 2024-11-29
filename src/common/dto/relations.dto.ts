import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class RelationsArgs {
  @IsArray({
    message: 'Relations must be an array of strings',
  })
  @ApiProperty({
    description: 'Array of relations to include',
    example: ['driverIdentity'],
  })
  relations?: string[];
}
