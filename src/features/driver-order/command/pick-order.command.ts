import { DRIVER_STATUS_ENUM, ORDER_QUEUE, ORDER_STATUS_ENUM } from '@constants';
import { DriverService } from '@features/driver/driver.service';
import { DriverEntity } from '@features/driver/entities';
import { OrderStatusEntity } from '@features/order-status/order-status.entity';
import { OrderAssignmentEntity } from '@features/order/entities/order-assignment.entity';
import { OrderEntity } from '@features/order/entities/order.entity';
import { OrderService } from '@features/order/order.service';
import { RedisEvents } from '@features/redis/events';
import { UpdateCacheValueEvent } from '@features/redis/events/update-value.event';
import { InjectQueue } from '@nestjs/bullmq';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { DataSource } from 'typeorm';
import {
  CommandDriverOrder,
  IDataCommandDriverOrder,
} from './command.interface';

@Injectable()
export class PickOrderCommand implements CommandDriverOrder {
  private readonly logger = new Logger(PickOrderCommand.name);

  constructor(
    private readonly driverService: DriverService,
    private readonly orderService: OrderService,
    private readonly dataSource: DataSource,
    private readonly emitter: EventEmitter2,
    @InjectQueue(ORDER_QUEUE.NAME) private readonly queue: Queue,
  ) {}

  async execute(data: IDataCommandDriverOrder): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const driver = await this.driverService.findById(data.idDriver, [], {
        id: true,
        balance: true,
        state: true,
        idOrder: true,
      });

      if (!driver) {
        this.logger.error(`Driver not found: ${data.idDriver}`);
        throw new BadRequestException('Tài xế không tồn tại');
      }

      if (driver.idOrder || driver.state !== DRIVER_STATUS_ENUM.FREE) {
        this.logger.error(`Driver is busy: ${data.idDriver}`);
        throw new BadRequestException('Tài xế đang bận');
      }

      const order = await this.orderService.findByField(
        {
          id: data.idOrder,
          currentStatus: ORDER_STATUS_ENUM.PENDING,
          potentialDriverId: null,
        },
        [],
        {
          id: true,
          totalPrice: true,
          currentStatus: true,
        },
      );
      if (!order) {
        this.logger.error(`Order not found: ${data.idOrder}`);
        throw new BadRequestException('Đơn hàng đã được Tài xế khác nhận rồi!');
      }

      const { realRevenue } = this.driverService.calculateDiscountPrice(
        order.totalPrice,
      );

      const updateBalance = driver.balance - (order.totalPrice - realRevenue);

      if (updateBalance < 0) {
        this.logger.error(`Driver has not enough money: ${data.idDriver}`);
        throw new BadRequestException('Tài khoản không đủ tiền');
      }

      await queryRunner.manager.insert(OrderAssignmentEntity, {
        order: {
          id: data.idOrder,
        },
        driver: {
          id: data.idDriver,
        },
      });
      await queryRunner.manager.insert(OrderStatusEntity, {
        order: {
          id: data.idOrder,
        },
        status: ORDER_STATUS_ENUM.PENDING_PICKUP,
      });

      await queryRunner.manager.update(DriverEntity, driver.id, {
        idOrder: data.idOrder,
        balance: updateBalance,
        state: DRIVER_STATUS_ENUM.DELIVERY,
      });
      await queryRunner.manager.update(OrderEntity, data.idOrder, {
        potentialDriverId: data.idDriver,
        currentStatus: ORDER_STATUS_ENUM.PENDING_PICKUP,
        driver: {
          id: driver.id,
        },
      });

      this.emitter.emit(
        RedisEvents.UPDATE_VALUE,
        new UpdateCacheValueEvent(`driver:${data.idDriver}`, {
          balance: updateBalance,
          idOrder: data.idOrder,
          state: DRIVER_STATUS_ENUM.DELIVERY,
        }),
      );

      // submit into queue to check order after 15 minutes
      this.queue.add(ORDER_QUEUE.PICKUP_CHECKING, data.idOrder, {
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        delay: 60 * 10 * 1000,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(`Error when pick order: ${error.message}`);
      await queryRunner.rollbackTransaction();
      throw new BadGatewayException('Lỗi khi nhận đơn hàng');
    } finally {
      await queryRunner.release();
    }
  }
}
