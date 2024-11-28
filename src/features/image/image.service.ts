import { CloudflareService } from '@features/cloudflare/cloudflare.service';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { SignUrlInput } from './dto/sign-url.input';

@Injectable()
export class ImageService {
  constructor(private readonly cloudflareService: CloudflareService) {}

  async getSignedUrl(data: SignUrlInput) {
    const { fileName, contentType } = data;
    const suffix = fileName.split('.').pop();
    const uuid = uuidv4();

    const fileNameWithUuid = `${uuid}.${suffix}`;
    const url = await this.cloudflareService.getSignedUrl(
      fileNameWithUuid,
      contentType,
    );

    return { url, key: fileNameWithUuid };
  }
}
