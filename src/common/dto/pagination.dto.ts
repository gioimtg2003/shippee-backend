import { IPaginateResult } from '@common/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, Max, Min } from 'class-validator';
import { SortOrderInput } from './sort.dto';

export class PaginateOptions {
  @ApiProperty({
    example: 1,
    description: 'Page number',
  })
  @IsNumber()
  @IsOptional()
  @Max(100)
  @Min(1)
  skip?: number;

  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
  })
  @IsNumber()
  @IsOptional()
  @Max(100)
  @Min(1)
  take?: number;

  @ApiProperty({
    example: {
      createdAt: 'desc',
    },
    description: 'Sort order',
  })
  @IsOptional()
  @IsObject()
  sort?: SortOrderInput;

  // @Field(() => FilterInput, { nullable: true })
  // filter?: FilterInput;
}

export function Paginate<T>(): any {
  abstract class PaginateClass implements IPaginateResult<T> {
    items: T[];

    total: number;
  }
  return PaginateClass;
}
