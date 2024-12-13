import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('mail')
export class EmailConsumer extends WorkerHost {
  async process(job: Job, token?: string): Promise<any> {
    try {
      // Simulate sending an email
      console.log(job);
      console.log(
        `Sending email to ${job.data.to} with subject: ${job.data.subject}`,
      );
      // Here you would integrate with an actual email service
      return Promise.resolve({ success: true });
    } catch (error) {
      console.error('Error processing job:', error);
      return Promise.reject(error);
    }
  }
}
