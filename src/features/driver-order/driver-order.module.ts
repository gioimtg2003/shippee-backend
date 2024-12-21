import { ORDER_QUEUE } from '@constants';
import { DriverModule } from '@features/driver/driver.module';
import { OrderModule } from '@features/order';
import { OrderStatusModule } from '@features/order-status';
import { RedisModule } from '@features/redis';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PickOrderCommand } from './command';
import { ArrivedPickupOrder } from './command/arrived-pickup-order.command';
import { ArrivedRecipientCommand } from './command/arrived-recipient.command';
import { PickedOrderCommand } from './command/picked.order.command';
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
    OrderStatusModule,
  ],
  controllers: [DriverOrderController],
  providers: [
    DriverOrderService,
    PickOrderCommand,
    ArrivedPickupOrder,
    PickedOrderCommand,
    ArrivedRecipientCommand,
  ],
})
export class DriverOrderModule {}
