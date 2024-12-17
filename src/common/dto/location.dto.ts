import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class LocationDto {
  @ApiProperty({
    description: 'Longitude',
    example: 100.0,
  })
  @IsNumber()
  @IsNotEmpty({
    message: 'Longitude is required',
  })
  @Min(-180)
  @Max(180)
  lng: number;

  @ApiProperty({
    description: 'latitude',
    example: 100.0,
  })
  @IsNumber()
  @IsNotEmpty({
    message: 'Longitude is required',
  })
  @Min(-90)
  @Max(90)
  lat: number;
}
