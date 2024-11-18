import { ResponseDTO } from '@common/dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { CreateDriverInput } from './create-driver.input';

export class UpdateDriverInput extends PartialType(CreateDriverInput) {
  @ApiProperty({
    description: 'Driver ID',
    example: '12',
  })
  @IsNotEmpty()
  @IsNumber()
  @Max(999)
  @Min(1)
  id: number;
}

export class ResponseUpdateDriverDTO extends ResponseDTO {
  @ApiProperty({
    example: {},
    description: 'Data response',
  })
  data: UpdateDriverInput;
}
