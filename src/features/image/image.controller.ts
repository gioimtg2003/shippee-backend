import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImageService } from './image.service';

@ApiTags('image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: 'Get signed URL' })
  @ApiResponse({ status: 200, description: 'Return signed URL', type: String })
  @Get('signed-url')
  signedUrl() {
    return this.imageService.getSignedUrl();
  }
}
