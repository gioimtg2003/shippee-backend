import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateDriverInfoInput {
  @ApiProperty({
    description: 'Driver ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Max(9999)
  @Min(1)
  idDriver: number;
}
