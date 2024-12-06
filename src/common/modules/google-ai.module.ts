import { GoogleAIService } from '@common/services';
import { Module } from '@nestjs/common';

@Module({
  providers: [GoogleAIService],
  exports: [GoogleAIService],
})
export class GoogleAIModule {}
