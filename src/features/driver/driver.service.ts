import { DriverSession } from '@common/dto';
import { applyQueryFilter } from '@common/query-builder';
import { EXPIRE_CACHE_DRIVER, Role } from '@constants';
import { CryptoService } from '@features/crypto';
import { FilterDriverOptionsDto } from '@features/driver-manage/dto';
import { RedisCacheService } from '@features/redis';
import { CacheValueEvent, RedisEvents } from '@features/redis/events';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { getEndOfDay } from '@utils';
import {
  FindOptionsSelect,
  FindOptionsSelectByString,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { CreateDriverInput } from './dto/create-driver.input';
import { DriverEntity } from './entities';

@Injectable()
export class DriverService {
  private readonly logger = new Logger(DriverService.name);
  constructor(
    @InjectRepository(DriverEntity)
    private readonly driverRepo: Repository<DriverEntity>,
    private readonly cryptoService: CryptoService,
    private readonly redisService: RedisCacheService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private exists(where: FindOptionsWhere<DriverEntity> = {}) {
    return this.driverRepo.findOne({
      where,
      select: ['id'],
    });
  }

  count(where: FindOptionsWhere<DriverEntity> = {}) {
    return this.driverRepo.count({ where });
  }

  async findByField<T>(
    where: FindOptionsWhere<T>,
    relations: string[] = [],
    select:
      | FindOptionsSelectByString<DriverEntity>
      | FindOptionsSelect<DriverEntity> = [
      'id',
      'name',
      'phone',
      'email',
      'balance',
      'isAiChecked',
      'isIdentityVerified',
      'isRejected',
    ],
  ) {
    this.logger.debug(`Finding driver by ${where}}`);

    const found = await this.driverRepo.findOne({
      where,
      relations,
      select,
    });

    return found;
  }

  findAll(options: FilterDriverOptionsDto = {}) {
    const query = this.driverRepo.createQueryBuilder('drivers');

    if (options.name) {
      query.andWhere('drivers.name LIKE :name', { name: `%${options.name}%` });
    }

    if (options.createdAt) {
      const endOfDay = getEndOfDay(options.createdAt);

      query.andWhere('drivers.createdAt BETWEEN :start AND :end', {
        start: options.createdAt,
        end: endOfDay.toISOString(),
      });
    }
    if (options.status) {
      if (options.status !== 'all') {
        query.andWhere('drivers.isIdentityVerified = :isIdentityVerified', {
          isIdentityVerified: options.status === 'verified',
        });
      }
    }

    query.select([
      'drivers.id',
      'drivers.name',
      'drivers.phone',
      'drivers.email',
      'drivers.createdAt',
      'drivers.isIdentityVerified',
    ]);
    applyQueryFilter(query, options);

    return query.getMany();
  }

  findById(
    id: number,
    relations: string[] = [],
    select?:
      | FindOptionsSelectByString<DriverEntity>
      | FindOptionsSelect<DriverEntity>,
  ) {
    return this.findByField({ id }, relations, select);
  }

  findByPhone(phone: string, relations: string[] = []) {
    return this.findByField({ phone }, relations, [
      'id',
      'phone',
      'password',
      'isIdentityVerified',
      'identity',
      'balance',
      'isAiChecked',
    ]);
  }

  async create(data: CreateDriverInput): Promise<DriverEntity> {
    this.logger.log('Creating driver...');
    const existed = await this.exists({ phone: data.phone, email: data.email });
    if (existed) {
      this.logger.error('⚠️ Driver already exists');
      throw new BadRequestException('Driver already exists');
    }

    data.password = await this.cryptoService.hash(data.password);

    const driver = this.driverRepo.create({
      ...data,
      transportType: {
        id: data.transportTypeId,
      },
    });
    const saved = await this.driverRepo.save(driver);

    if (!saved.id) {
      this.logger.error('⚠️ Error creating driver');
      throw new BadRequestException('Error creating driver');
    }

    return driver;
  }

  async update(id: number, data: Partial<DriverEntity>) {
    this.logger.log(`Updating driver with id: ${id}`);
    const found = await this.findById(id);

    if (!found) {
      this.logger.error('⚠️ Driver not found');
      throw new BadRequestException('Driver not found');
    }

    Object.assign(found, data);

    const updated = await this.driverRepo.save({
      ...found,
    });

    if (!updated.id) {
      this.logger.error('⚠️ Error updating driver');
      throw new BadRequestException('Error updating driver');
    }
    this.logger.log(`Driver updated: ${updated.id}`);

    return updated;
  }

  async meProfile(idDriver: number) {
    this.logger.log(`Getting profile of driver with id: ${idDriver}`);
    const cache = await this.redisService.get(`driver:${idDriver}`);

    if (cache) {
      const driver: DriverSession = JSON.parse(cache);
      return driver;
    }
    const found = await this.findById(idDriver);

    if (!found) {
      this.logger.error(`⚠️ Driver not found with id: ${idDriver}`);
      throw new BadRequestException('Driver not found');
    }

    const driver: DriverSession = {
      id: found.id,
      phone: found.phone,
      email: found.email,
      name: found.name,
      role: Role.DRIVER,
      isAiChecked: found.isAiChecked,
      isIdentityVerified: found.isIdentityVerified,
      balance: found.balance,
    };

    this.eventEmitter.emit(
      RedisEvents.CACHE_VALUE,
      new CacheValueEvent(
        {
          key: `driver:${found.id}`,
          value: JSON.stringify(driver),
        },
        EXPIRE_CACHE_DRIVER,
      ),
    );

    return found;
  }

  async softDelete(id: number) {
    this.logger.log(`Soft deleting driver with id: ${id}`);
    const found = await this.findById(id);

    if (!found) {
      this.logger.error('⚠️ Driver not found');
      throw new BadRequestException('Driver not found');
    }

    this.driverRepo.softDelete(id);
  }
}
