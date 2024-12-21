import { ORDER_ASSIGNMENT_STATUS_ENUM } from '@constants';
import { DriverService } from '@features/driver/driver.service';
import { OrderAssignmentService } from '@features/order/order-assignment.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly driverService: DriverService,
    private readonly orderAssignService: OrderAssignmentService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM, {
    name: 'acceptance-rate',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleAcceptanceRate() {
    this.logger.log('Start cron job acceptance rate');

    const drivers = await this.driverService.findAll({
      status: 'verified',
    });

    for (const driver of drivers) {
      const countAssigned = await this.orderAssignService.countByDriverId(
        driver.id,
        {
          where: { status: ORDER_ASSIGNMENT_STATUS_ENUM.ASSIGNED },
        },
      );

      const countNotAssigned = await this.orderAssignService.countByDriverId(
        driver.id,
        {
          where: [
            { status: ORDER_ASSIGNMENT_STATUS_ENUM.EXPIRE },
            {
              status: ORDER_ASSIGNMENT_STATUS_ENUM.REJECTED,
            },
          ],
        },
      );

      if (countAssigned === 0 || countNotAssigned === 0) {
        continue;
      }

      const total = countAssigned + countNotAssigned;
      const acceptanceRate = (countAssigned / total) * 100;
      if (acceptanceRate === 100) {
        continue;
      }

      await this.driverService.update(driver.id, {
        acceptanceRate,
      });
    }
  }

  @Timeout(5000)
  cron() {
    this.logger.log('Start cron job timeout');
  }
}
