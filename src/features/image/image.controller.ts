import { REQUEST_LIMIT_RATE } from '@constants';
import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ImageService } from './image.service';

@ApiTags('image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: 'Get signed URL' })
  @ApiResponse({ status: 200, description: 'Return signed URL', type: String })
  @Post('signed-url')
  @Throttle({ default: REQUEST_LIMIT_RATE.signedUrl })
  signedUrl() {
    return this.imageService.getSignedUrl();
  }
}
