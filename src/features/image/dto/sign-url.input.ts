import { BUCKET } from '@constants';
import { IsImageFileName, IsImageType } from '@decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

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

  @ApiProperty({
    description: 'Bucket',
    example: BUCKET.DRIVER,
    enum: BUCKET,
  })
  @IsNotEmpty()
  @IsEnum(BUCKET)
  bucket: BUCKET;
}

export class ResponseSignUrl {
  @ApiProperty({
    description: 'Signed URL',
    example:
      'https://ship.abc9asd.r2.cloudflarestorage.com/hihi.png?X-Amz-Algorithm=AWS4-H MAC-SHA256&X-Amz-Content-Sha256=d64ccf0d4b1449153d78215ffff23asd0de1fd2b357e153026c9a3fada96&X-Amz-Credential=sda32423',
  })
  url: string;

  @ApiProperty({
    description: 'Key',
    example: '1234-1234-1234-1234.png',
  })
  key: string;
}
