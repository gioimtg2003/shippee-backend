import { BUCKET, EXPIRE_GET_BUCKET } from '@constants';
import { CloudflareService } from '@features/cloudflare/cloudflare.service';
import { RedisCacheService } from '@features/redis';
import { CacheValueEvent, RedisEvents } from '@features/redis/events';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { v4 as uuidv4 } from 'uuid';
import { SignUrlInput } from './dto/sign-url.input';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  constructor(
    private readonly cloudflareService: CloudflareService,
    private readonly eventEmitter: EventEmitter2,
    private readonly cacheService: RedisCacheService,
  ) {}

  async getSignedUrlUploadDocument(data: SignUrlInput) {
    const { fileName, contentType } = data;
    const fileNameWithUuid = this.extractSuffix(fileName);

    const url = await this.cloudflareService.getSignedUrl(
      fileNameWithUuid,
      contentType,
      BUCKET.DRIVER,
    );

    return { url, key: fileNameWithUuid };
  }

  async getUrlImgDocument(key: string) {
    this.logger.log(`Getting bucket for key: ${key}`);

    const cacheKey = `${BUCKET.DRIVER}:${key}`;
    const cacheValue = await this.cacheService.get(cacheKey);

    if (cacheValue) {
      this.logger.log(`Cache hit for cacheKey: ${cacheKey}`);
      return cacheValue;
    }

    const url = await this.cloudflareService.getBucket(key, BUCKET.DRIVER);

    this.eventEmitter.emit(
      RedisEvents.CACHE_VALUE,
      new CacheValueEvent(
        {
          key: cacheKey,
          value: url,
        },
        EXPIRE_GET_BUCKET - 10,
      ),
    );

    return url;
  }

  private extractSuffix(fileName: string) {
    const suffix = fileName.split('.').pop();
    const uuid = uuidv4();

    return `${uuid}.${suffix}`;
  }
}
