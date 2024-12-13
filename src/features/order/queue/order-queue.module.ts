import { ORDER_QUEUE } from '@constants';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { OrderModule } from '../order.module';
import { OrderQueueConsumer } from './order-queue.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: ORDER_QUEUE.NAME,
    }),
    OrderModule,
  ],
  providers: [OrderQueueConsumer],
})
export class OrderQueueModule {}
