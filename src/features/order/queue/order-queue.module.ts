import { ORDER_QUEUE } from '@constants';
import { MailModule } from '@features/mail';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { OrderModule } from '../order.module';
import { OrderQueueConsumer } from './order-queue.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: ORDER_QUEUE.NAME,
    }),
    OrderModule,
    MailModule,
  ],
  providers: [OrderQueueConsumer],
})
export class OrderQueueModule {}
