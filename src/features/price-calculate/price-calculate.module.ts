import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExceedSegmentPriceEntity } from './enities/exceed-segment-price.entity';
import { PriceInfoEntity } from './enities/price-info.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExceedSegmentPriceEntity, PriceInfoEntity]),
  ],
  controllers: [],
  providers: [],
})
export class PriceCalculateModule {}
