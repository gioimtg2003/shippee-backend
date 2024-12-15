import { ORDER_QUEUE } from '@constants';
import { DriverModule } from '@features/driver/driver.module';
import { OrderModule } from '@features/order';
import { RedisModule } from '@features/redis';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PickOrderCommand } from './command';
import { DriverOrderController } from './driver-order.controller';
import { DriverOrderService } from './driver-order.service';

@Module({
  imports: [
    OrderModule,
    RedisModule,
    JwtModule,
    DriverModule,
    BullModule.registerQueue({
      name: ORDER_QUEUE.NAME,
    }),
  ],
  controllers: [DriverOrderController],
  providers: [DriverOrderService, PickOrderCommand],
})
export class DriverOrderModule {}
