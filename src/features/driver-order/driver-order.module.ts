import { OrderModule } from '@features/order';
import { RedisModule } from '@features/redis';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DriverOrderController } from './driver-order.controller';
import { DriverOrderService } from './driver-order.service';

@Module({
  imports: [OrderModule, RedisModule, JwtModule],
  controllers: [DriverOrderController],
  providers: [DriverOrderService],
})
export class DriverOrderModule {}
