import { IsImageFileName, IsImageType } from '@decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignUrlInput {
  @ApiProperty({
    description: 'File name',
    example: 'image.jpg',
  })
  @IsNotEmpty()
  @IsString()
  @IsImageFileName()
  fileName: string;

  @ApiProperty({
    description: 'Content type',
    example: 'image/jpeg',
  })
  @IsNotEmpty()
  @IsString()
  @IsImageType()
  contentType: string;
}
