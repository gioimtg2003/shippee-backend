import { DriverSession } from '@common/dto';
import {
  DRIVER_STATUS_ENUM,
  EXPIRE_CACHE_PENDING_ORDER,
  IS_PENDING_ORDER_KEY,
  MAX_DISTANCE,
  ORDER_ASSIGNMENT_STATUS_ENUM,
  ORDER_STATUS_ENUM,
} from '@constants';
import { DriverService } from '@features/driver/driver.service';
import { RedisCacheService } from '@features/redis';
import { CacheValueEvent, RedisEvents } from '@features/redis/events';
import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { CalculateDistance } from '@utils';
import { FindManyOptions, Repository } from 'typeorm';
import { OrderAssignmentEntity } from './entities/order-assignment.entity';
import { OrderEntity } from './entities/order.entity';
import {
  ORDER_EVENT_ENUM,
  OrderAssignCheckingEvent,
  OrderAssignEvent,
} from './events';
import { OrderService } from './order.service';

@Injectable()
export class OrderAssignmentService implements OnModuleInit {
  private readonly logger = new Logger(OrderAssignmentService.name);
  constructor(
    @InjectRepository(OrderAssignmentEntity)
    private readonly repoOrderAssign: Repository<OrderAssignmentEntity>,
    private readonly driverService: DriverService,
    private readonly redisService: RedisCacheService,
    private readonly orderService: OrderService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  onModuleInit() {
    this.eventEmitter.on(ORDER_EVENT_ENUM.PENDING_CHECKING, async () => {
      const pendingOrdersId = await this.orderService.getOrderPending();

      if (pendingOrdersId.length === 0) {
        return;
      }

      await this.assignDriver(new OrderAssignEvent(pendingOrdersId[0].id));
    });
  }

  async create(idOrder: number, idDriver: number) {
    const created = this.repoOrderAssign.create({
      order: { id: idOrder },
      driver: { id: idDriver },
    });

    const saved = await this.repoOrderAssign.save(created);

    if (!saved.id) {
      this.logger.error('Failed to save order assignment');
      throw new BadRequestException('Failed to save order assignment');
    }

    this.logger.log(`Order assignment created: ${saved.id}`);
    return saved;
  }

  countByDriverId(
    idDriver: number,
    options: FindManyOptions<OrderAssignmentEntity> = {},
  ) {
    return this.repoOrderAssign.count({
      where: {
        driver: { id: idDriver },
        ...options.where,
      },
      ...options,
    });
  }

  countAssignedByDriverId(idDriver: number) {
    return this.repoOrderAssign
      .createQueryBuilder('order_assignment')
      .select('order_assignment.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('order_assignment.status IN (:...statuses)', {
        statuses: [
          ORDER_ASSIGNMENT_STATUS_ENUM.ASSIGNED,
          ORDER_ASSIGNMENT_STATUS_ENUM.EXPIRE,
          ORDER_ASSIGNMENT_STATUS_ENUM.REJECTED,
        ],
      })
      .groupBy('order_assignment.status')
      .getRawMany();
  }

  async update(id: number, data: Partial<OrderAssignmentEntity>) {
    const found = await this.repoOrderAssign.findOne({ where: { id } });
    if (!found) {
      this.logger.error('Order assignment not found');
      throw new BadRequestException('Order assignment not found');
    }
    Object.assign(found, data);

    const updated = await this.repoOrderAssign.save({
      ...found,
    });

    if (!updated.id) {
      this.logger.error('Failed to update order assignment');
      throw new BadRequestException('Failed to update order assignment');
    }

    this.logger.log(`Order assignment updated: ${updated.id}`);

    return updated;
  }

  @OnEvent(ORDER_EVENT_ENUM.ASSIGN)
  async assignDriver({ idOrder }: OrderAssignEvent) {
    const drivers = await this.redisService.getAll<DriverSession>('driver:*');
    if (!drivers.length) {
      this.logger.log('No driver available');
      this.cacheOrderNotAssigned();
      return;
    }

    const order = await this.orderService.findById(idOrder);
    if (!order) {
      this.logger.error('Order not found');
      return;
    }

    const driverSessions = drivers.map((driver) => driver.value);
    const potentialDrivers = await this.getPotentialDrivers(
      driverSessions,
      order,
    );

    if (!potentialDrivers.length) {
      this.logger.log('No driver available');
      this.cacheOrderNotAssigned();
      return;
    }

    const selectedDriver = this.selectDriver(potentialDrivers);
    await this.create(idOrder, selectedDriver.id);
    await this.orderService.update(idOrder, {
      potentialDriverId: selectedDriver.id,
    });
    this.cacheOrderNotAssigned('false');

    this.eventEmitter.emit(
      ORDER_EVENT_ENUM.ASSIGN_CHECKING,
      new OrderAssignCheckingEvent(idOrder),
    );
  }

  private async getPotentialDrivers(
    drivers: DriverSession[],
    order: OrderEntity,
  ) {
    const potentialDrivers: {
      id: number;
      acceptanceRate: number;
      distance: number;
      orderAssigned: number;
    }[] = [];

    for (const driver of drivers) {
      if (this.isDriverEligible(driver)) {
        const distance = CalculateDistance(
          driver.lat,
          driver.lng,
          order.pickup.coordinates[1],
          order.pickup.coordinates[0],
        );

        if (Number(distance) <= MAX_DISTANCE) {
          const found = await this.driverService.findByField(
            { id: driver.id },
            [],
            ['acceptanceRate', 'id'],
          );

          const countOrderAssigned = await this.countByDriverId(driver.id, {
            where: { status: ORDER_ASSIGNMENT_STATUS_ENUM.ASSIGNED },
          });

          if (countOrderAssigned <= 2) {
            potentialDrivers.push({
              id: found.id,
              acceptanceRate: found.acceptanceRate,
              distance: Number(distance),
              orderAssigned: countOrderAssigned,
            });
          }
        }
      }
    }

    return potentialDrivers;
  }

  private isDriverEligible(driver: DriverSession) {
    return (
      driver.lat &&
      driver.lng &&
      driver.isAiChecked &&
      driver.isIdentityVerified &&
      driver.balance > 0 &&
      driver.state === DRIVER_STATUS_ENUM.FREE
    );
  }

  private selectDriver(
    potentialDrivers: {
      id: number;
      acceptanceRate: number;
      distance: number;
    }[],
  ) {
    potentialDrivers.sort((a, b) => {
      if (a.acceptanceRate === b.acceptanceRate) {
        return a.distance - b.distance;
      }
      return b.acceptanceRate - a.acceptanceRate;
    });

    return potentialDrivers[0];
  }

  private cacheOrderNotAssigned(cache: 'true' | 'false' = 'true') {
    this.eventEmitter.emit(
      RedisEvents.CACHE_VALUE,
      new CacheValueEvent(
        {
          key: IS_PENDING_ORDER_KEY,
          value: cache,
        },
        EXPIRE_CACHE_PENDING_ORDER,
      ),
    );
  }

  private async checkOrderAssignment(idOrder: number) {
    const order = await this.orderService.findByField({ id: idOrder }, [], {
      currentStatus: true,
      id: true,
    });

    if (!order) {
      this.logger.error('Order not found');
      return;
    }

    if (order.currentStatus === ORDER_STATUS_ENUM.PENDING) {
      this.logger.log('Order is still pending');
      return false;
    }

    return order;
  }
}
