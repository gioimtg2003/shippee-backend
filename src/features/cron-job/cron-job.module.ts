import { DriverModule } from '@features/driver';
import { OrderModule } from '@features/order';
import { Module } from '@nestjs/common';
import { CronJobService } from './cron-job.service';
import { TasksService } from './tasks.service';
@Module({
  imports: [DriverModule, OrderModule],
  providers: [TasksService, CronJobService],
  exports: [TasksService],
})
export class CronJobModule {}
