import { DriverModule } from '@features/driver';
import { OrderModule } from '@features/order';
import { Module } from '@nestjs/common';
import { CronJobService } from './crob-job.service';

@Module({
  imports: [DriverModule, OrderModule],
  providers: [CronJobService],
  exports: [CronJobService],
})
export class CronJobModule {}
