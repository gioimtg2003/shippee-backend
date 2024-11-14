import { IsArray } from 'class-validator';

export class RelationsArgs {
  @IsArray({
    message: 'Relations must be an array of strings',
  })
  relations?: string[];
}
