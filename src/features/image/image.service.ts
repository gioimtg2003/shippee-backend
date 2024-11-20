import { CloudflareService } from '@features/cloudflare/cloudflare.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageService {
  constructor(private readonly cloudflareService: CloudflareService) {}

  async getSignedUrl() {
    return this.cloudflareService.getSignedUrl('hihi.png');
  }
}
