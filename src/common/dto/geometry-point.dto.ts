import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class GeometryPoint {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  type: string;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: number[];
}
