import { HashAuthGuard } from '@common/guards';
import { REQUEST_LIMIT_RATE } from '@constants';
import { HashFields } from '@decorators';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiHeaders,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { SignUrlInput } from './dto/sign-url.input';
import { ImageService } from './image.service';

@ApiTags('image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({
    summary: 'Get signed URL',
    description:
      'Get signed URL for uploading image. The URL will be expired in 30 seconds.',
  })
  @ApiHeaders([
    {
      name: 'x-shipppee-timestamp',
      description: 'Request timestamp',
    },
    {
      name: 'x-shipppee-sha-256',
      description: 'SHA-256 hash of the request',
    },
  ])
  @ApiResponse({
    status: 200,
    description: 'Return signed URL',
    type: String,
    example: {
      url: 'https://ship.abc9asd.r2.cloudflarestorage.com/hihi.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=d64ccf0d4b1449153d78215ffff23asd0de1fd2b357e153026c9a3fada96&X-Amz-Credential=sda32423dasd060f73%2F20241120%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20241120T104831Z&X-Amz-Expires=30&X-Amz-Signature=5c532bae6ae932dasd44279fa980ec3bac64d5a210b037319f06d86f1&X-Amz-SignedHeaders=content-type%3Bhost%3Bx-amz-checksum-sha256&x-id=PutObject',
      key: '1234-1234-1234-1234.png',
    },
  })
  @Post('signed-url')
  @Throttle({ default: REQUEST_LIMIT_RATE.signedUrl })
  @UseGuards(HashAuthGuard)
  @HashFields('fileName')
  @HttpCode(HttpStatus.OK)
  signedUrl(@Body() data: SignUrlInput) {
    return this.imageService.getSignedUrl(data);
  }
}
