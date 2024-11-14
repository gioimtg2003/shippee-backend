import { IsEnum, IsOptional } from 'class-validator';

export enum SortOrder {
  asc = 'ASC',
  desc = 'DESC',
}

export class SortOrderInput {
  @IsEnum(SortOrder, { message: 'Invalid sort order' })
  @IsOptional()
  createdAt: SortOrder;

  @IsEnum(SortOrder, { message: 'Invalid sort order' })
  @IsOptional()
  updatedAt: SortOrder;
}
