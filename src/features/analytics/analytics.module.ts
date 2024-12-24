import { DriverModule } from '@features/driver';
import { OrderModule } from '@features/order';
import { RedisModule } from '@features/redis';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [DriverModule, OrderModule, RedisModule, JwtModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [],
})
export class AnalyticsModule {}
