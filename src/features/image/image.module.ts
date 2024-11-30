import { CloudflareModule } from '@features/cloudflare';
import { CryptoModule } from '@features/crypto';
import { RedisModule } from '@features/redis';
import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
  imports: [RedisModule, CloudflareModule, CryptoModule],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
