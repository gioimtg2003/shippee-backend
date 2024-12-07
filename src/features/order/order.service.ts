import { DriverService } from '@features/driver/driver.service';
import { RedisCacheService } from '@features/redis';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async assignDriver() {
    const drivers = await this.redisService.getAll<number>('driver:*');
  }
}
