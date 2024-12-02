import { IsOptional, IsString } from 'class-validator';

export class FilterDriverOptionsDto {
  @IsOptional()
  @IsString()
  createdAt?: string;

  @IsOptional()
  @IsString()
  verifyAt?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
