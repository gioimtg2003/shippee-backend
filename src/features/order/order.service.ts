import { DriverSession } from '@common/dto';
import { MAX_DISTANCE } from '@constants';
import { DriverService } from '@features/driver/driver.service';
import { RedisCacheService } from '@features/redis';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CalculateDistance } from '@utils';
import { FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(OrderEntity)
    private readonly repo: Repository<OrderEntity>,
    private readonly driverService: DriverService,
    private readonly redisService: RedisCacheService,
  ) {}

  findByField(
    where: FindOptionsWhere<OrderEntity>,
    relations: string[] = [],
    select?: FindOptionsSelect<OrderEntity>,
  ) {
    return this.repo.findOne({ where, relations, select });
  }

  findById(id: number, relations: string[] = []) {
    return this.findByField({ id }, relations);
  }

  findByDriverId(driverId: number, relations: string[] = []) {
    return this.repo.find({
      where: {
        driver: { id: driverId },
      },
      relations,
    });
  }

  async create(data: Partial<OrderEntity>) {
    const created = this.repo.create(data);
    if (!created) {
      this.logger.error('Failed to create order');
      throw new BadRequestException('Failed to create order');
    }

    const saved = await this.repo.save(created);

    if (!saved.id) {
      this.logger.error('Failed to save order');
      throw new BadRequestException('Failed to save order');
    }
    this.logger.log(`Order created: ${saved.id}`);
    return saved;
  }

  async update(id: number, data: Partial<OrderEntity>) {
    const order = await this.findById(id);
    if (!order) {
      this.logger.error('Order not found');
      throw new BadRequestException('Order not found');
    }
    Object.assign(order, data);

    const updated = await this.repo.save(order);
    if (!updated) {
      this.logger.error('Failed to update order');
      throw new BadRequestException('Failed to update order');
    }
    this.logger.log(`Order updated: ${updated.id}`);
    return updated;
  }

  async assignDriver(idOrder: number) {
    const drivers = await this.redisService.getAll<DriverSession>('driver:*');
    if (!drivers.length) {
      this.logger.log('No driver available');
      return;
    }

    const order = await this.findById(idOrder);
    if (!order) {
      this.logger.error('Order not found');
      throw new BadRequestException('Order not found');
    }

    const driverSessions = drivers.map((driver) => driver.value);
    const potentialDrivers = await this.getPotentialDrivers(
      driverSessions,
      order,
    );

    if (!potentialDrivers.length) {
      this.logger.log('No driver available');
      return;
    }

    const selectedDriver = this.selectDriver(potentialDrivers);
    const driverEntity = await this.driverService.findById(selectedDriver.id);
    await this.update(idOrder, { driver: driverEntity });
  }

  private async getPotentialDrivers(
    drivers: DriverSession[],
    order: OrderEntity,
  ) {
    const potentialDrivers: {
      id: number;
      acceptanceRate: number;
      distance: number;
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
          potentialDrivers.push({
            id: found.id,
            acceptanceRate: found.acceptanceRate,
            distance: Number(distance),
          });
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
      driver.balance > 0
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
}
