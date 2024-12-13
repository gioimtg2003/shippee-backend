import { ORDER_QUEUE } from '@constants';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { OrderService } from '../order.service';

@Processor(ORDER_QUEUE.NAME)
export class OrderQueueConsumer extends WorkerHost {
  private readonly logger = new Logger(OrderQueueConsumer.name);

  constructor(private readonly orderService: OrderService) {
    super();
  }

  async process(job: Job<number>, token?: string) {
    switch (job.name) {
      case ORDER_QUEUE.ASSIGN:
        console.log('Assigning order');
        return {};

      default:
        this.logger.error('Invalid job name');
        return Promise.reject('Invalid job name');
    }
  }
}
