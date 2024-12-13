import { DriverSession } from '@common/dto';
import {
  DRIVER_STATUS_ENUM,
  EXPIRE_CACHE_PENDING_ORDER,
  IS_PENDING_ORDER_KEY,
  MAX_DISTANCE,
  ORDER_ASSIGNMENT_STATUS_ENUM,
  ORDER_QUEUE,
  ORDER_STATUS_ENUM,
} from '@constants';
import { DriverService } from '@features/driver/driver.service';
import { MapBoxService } from '@features/mapbox';
import { RedisCacheService } from '@features/redis';
import { CacheValueEvent, RedisEvents } from '@features/redis/events';
import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { FindManyOptions, Repository } from 'typeorm';
import { OrderAssignmentEntity } from './entities/order-assignment.entity';
import { ORDER_EVENT_ENUM, OrderAssignEvent } from './events';
import { OrderService } from './order.service';

@Injectable()
export class OrderAssignmentService implements OnModuleInit {
  private readonly logger = new Logger(OrderAssignmentService.name);
  constructor(
    @InjectRepository(OrderAssignmentEntity)
    private readonly repoOrderAssign: Repository<OrderAssignmentEntity>,
    @InjectQueue(ORDER_QUEUE.NAME) private readonly queue: Queue,
    private readonly driverService: DriverService,
    private readonly redisService: RedisCacheService,
    private readonly orderService: OrderService,
    private readonly eventEmitter: EventEmitter2,
    private readonly mapBoxService: MapBoxService,
  ) {}

  onModuleInit() {
    this.eventEmitter.on(ORDER_EVENT_ENUM.PENDING_CHECKING, async () => {
      const pendingOrdersId = await this.orderService.getOrderPending();

      if (pendingOrdersId.length === 0) {
        return;
      }

      this.queue.add(ORDER_QUEUE.ASSIGN, pendingOrdersId[0].id, {
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      });
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

    const order = await this.orderService.findById(idOrder, [], {
      pickup: {
        coordinates: true,
      },
      id: true,
    });

    if (!order) {
      this.logger.error('Order not found');
      return;
    }
    const driverSessions = drivers.map((driver) => driver.value);

    const potentialDrivers = await this.getPotentialDrivers(
      driverSessions,
      order.pickup.coordinates,
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

    return {
      idOrder,
      idDriver: selectedDriver.id,
    };
  }

  /**
   * Retrieves a list of potential drivers based on their eligibility, distance from the given coordinates,
   * acceptance rate, and the number of orders assigned to them.
   *
   * @param drivers - An array of driver sessions containing driver information.
   * @param coordinates - A tuple representing the latitude and longitude of the location to calculate distance from.
   * @returns A promise that resolves to an array of potential drivers with their id, acceptance rate, distance, and order assigned count.
   *
   * @remarks
   * This method filters drivers based on their eligibility and calculates the distance between the driver's location
   * and the given coordinates using the MapBox service. It then checks if the driver is within the maximum allowed distance
   * and has fewer than or equal to 2 assigned orders. Eligible drivers are added to the potential drivers list.
   *
   * @example
   * ```typescript
   * const drivers = [
   *   { id: 1, lat: 40.7128, lng: -74.0060, ... },
   *   { id: 2, lat: 34.0522, lng: -118.2437, ... },
   * ];
   * const coordinates: [number, number] = [37.7749, -122.4194];
   * const potentialDrivers = await getPotentialDrivers(drivers, coordinates);
   * console.log(potentialDrivers);
   * ```
   */
  private async getPotentialDrivers(
    drivers: DriverSession[],
    coordinates: [number, number],
  ) {
    const potentialDrivers: {
      id: number;
      acceptanceRate: number;
      distance: number;
      orderAssigned: number;
    }[] = [];
    this.logger.log(`Drivers: ${JSON.stringify(drivers)}`);

    for (const driver of drivers) {
      if (this.isDriverEligible(driver)) {
        const distance = await this.mapBoxService.getDistance(
          [driver['lat'], driver['lng']],
          [coordinates[0], coordinates[1]],
        );

        if (Math.ceil(distance.routes[0].distance) <= MAX_DISTANCE) {
          const found = await this.driverService.findByField(
            { id: driver.id },
            [],
            ['acceptanceRate', 'id'],
          );

          const countOrderAssigned = await this.countByDriverId(driver.id, {
            where: { status: ORDER_ASSIGNMENT_STATUS_ENUM.ASSIGNED },
          });
          console.log(countOrderAssigned);
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
      driver['lat'] &&
      driver['lng'] &&
      driver['isAiChecked'] &&
      driver['isIdentityVerified'] &&
      driver['balance'] > 0 &&
      driver['state'] === DRIVER_STATUS_ENUM.FREE
    );
  }

  /**
   * Selects the most suitable driver from a list of potential drivers based on their acceptance rate and distance.
   *
   * The drivers are sorted primarily by their acceptance rate in descending order.
   * If two drivers have the same acceptance rate, they are then sorted by distance in ascending order.
   * The driver with the highest acceptance rate and shortest distance is selected.
   *
   * @param potentialDrivers - An array of potential drivers, each with an id, acceptance rate, and distance.
   * @returns The most suitable driver based on the sorting criteria.
   */
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

  /**
   * Caches the status of whether an order is assigned or not.
   *
   * @param cache - A string indicating whether to cache the order as 'true' or 'false'. Defaults to 'true'.
   *
   * This method logs the caching status and emits a `CACHE_VALUE` event with the cache key and value,
   * along with the expiration time for the cache.
   */
  private cacheOrderNotAssigned(cache: 'true' | 'false' = 'true') {
    this.logger.log(`Cache order not assigned: ${cache}`);
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
