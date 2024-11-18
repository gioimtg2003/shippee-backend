import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum SortOrder {
  asc = 'ASC',
  desc = 'DESC',
}

export class SortOrderInput {
  @ApiProperty({
    example: 'desc',
    description: 'Sort by createdAt',
  })
  @IsEnum(SortOrder, { message: 'Invalid sort order' })
  @IsOptional()
  createdAt: SortOrder;

  @ApiProperty({
    example: 'desc',
    description: 'Sort by updatedAt',
  })
  @IsEnum(SortOrder, { message: 'Invalid sort order' })
  @IsOptional()
  updatedAt: SortOrder;
}
