import { IPaginateResult } from '@common/interfaces';
import { IsNumber, IsObject, IsOptional } from 'class-validator';
import { SortOrderInput } from './sort.dto';

export class PaginateOptions {
  @IsNumber()
  @IsOptional()
  skip?: number;

  @IsNumber()
  @IsOptional()
  take?: number;

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
