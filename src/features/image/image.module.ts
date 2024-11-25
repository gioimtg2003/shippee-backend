import { CloudflareModule } from '@features/cloudflare';
import { CryptoModule } from '@features/crypto';
import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
  imports: [CloudflareModule, CryptoModule],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
