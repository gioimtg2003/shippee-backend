import { ORDER_QUEUE } from '@constants';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class OrderQueueProducer {
  constructor(
    @InjectQueue(ORDER_QUEUE.NAME) private readonly orderQueue: Queue,
  ) {}

  async assignOrder(orderId: number) {
    await this.orderQueue.add(ORDER_QUEUE.ASSIGN, orderId, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
    });
  }
}
