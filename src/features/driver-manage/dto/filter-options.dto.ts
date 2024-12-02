import { IsOptional, IsString } from 'class-validator';

export class FilterDriverOptionsDto {
  @IsOptional()
  @IsString()
  createdAt?: string;

  @IsOptional()
  @IsString()
  status?: 'all' | 'waiting' | 'verified';

  @IsOptional()
  @IsString()
  name?: string;
}
