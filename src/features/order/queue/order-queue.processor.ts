import { ORDER_QUEUE } from '@constants';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { OrderAssignmentService } from '../order-assignment.service';

@Processor(ORDER_QUEUE.NAME, {
  concurrency: 1,
  removeOnComplete: {
    age: 1000 * 60 * 60 * 24, // 1 day
    count: 100, // 100 jobs
  },
  drainDelay: 1000 * 60 * 5, // 5 minutes
  limiter: {
    max: 1,
    duration: 150,
  },
})
export class OrderQueueConsumer extends WorkerHost {
  private readonly logger = new Logger(OrderQueueConsumer.name);

  constructor(private readonly orderAssignmentService: OrderAssignmentService) {
    super();
  }

  /**
   * Processes a job from the order queue.
   */
  async process(job: Job<number>) {
    switch (job.name) {
      case ORDER_QUEUE.ASSIGN:
        this.logger.log(`Get job to assign driver for order: ${job.data}`);
        return await this.orderAssignmentService.assignDriver({
          idOrder: job.data,
        });

      case ORDER_QUEUE.PICKUP_CHECKING:
        this.logger.log(`Get job to check pickup for order: ${job.data}`);

      default:
        this.logger.error('Invalid job name');
        return Promise.reject('Invalid job name');
    }
  }

  @OnWorkerEvent('error')
  handleError(job: Job, error: any) {
    this.logger.error(error);
    this.logger.error(`Job ${job.id} failed`);
    // Send email or notification to admin
  }

  @OnWorkerEvent('completed')
  handleCompleted(job: Job) {
    this.logger.log(`Job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  handleFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed with error: ${error.message}`);
    // Send email or notification to admin
  }
}
