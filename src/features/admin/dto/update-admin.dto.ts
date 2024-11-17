import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { CreateAdminDto } from './create-admin.dto';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @ApiProperty({
    description: 'Admin user ID',
    example: '12',
  })
  @IsNotEmpty()
  @IsNumber()
  @Max(99)
  @Min(1)
  id: number;
}
