import { DriverSession } from '@common/dto';
import { applyQueryFilter } from '@common/query-builder';
import {
  EXPIRE_CACHE_DRIVER,
  IS_PENDING_ORDER_KEY,
  RATE_PIT,
  RATE_PLATFORM,
  RATE_VAT,
  Role,
} from '@constants';
import { CryptoService } from '@features/crypto';
import { FilterDriverOptionsDto } from '@features/driver-manage/dto';
import { ORDER_EVENT_ENUM } from '@features/order/events';
import { RedisCacheService } from '@features/redis';
import { CacheValueEvent, RedisEvents } from '@features/redis/events';
import { UpdateCacheValueEvent } from '@features/redis/events/update-value.event';
import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { getEndOfDay } from '@utils';
import {
  FindOptionsSelect,
  FindOptionsSelectByString,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { DriverOnlineCommand } from './command';
import { DriverOfflineCommand } from './command/driver-offline.command';
import { CreateDriverInput } from './dto/create-driver.input';
import { DriverStatusInput } from './dto/driver-status.input';
import { DriverEntity } from './entities';
import { DRIVER_EVENTS } from './events';

@Injectable()
export class DriverService implements OnModuleInit {
  private readonly logger = new Logger(DriverService.name);
  constructor(
    @InjectRepository(DriverEntity)
    private readonly driverRepo: Repository<DriverEntity>,
    private readonly cryptoService: CryptoService,
    private readonly redisService: RedisCacheService,
    private readonly eventEmitter: EventEmitter2,
    private readonly onlineCommand: DriverOnlineCommand,
    private readonly offlineCommand: DriverOfflineCommand,
  ) {}

  /**
   * Initializes the module and sets up an event listener for the DRIVER_ONLINE event.
   * When the DRIVER_ONLINE event is triggered, it checks if there is a pending order
   * by querying the Redis service. If a pending order is found, it logs a message
   * and emits the PENDING_CHECKING event.
   *
   * @async
   * @function
   * @memberof DriverService
   * @returns {Promise<void>} - A promise that resolves when the event listener is set up.
   */
  onModuleInit() {
    this.eventEmitter.on(DRIVER_EVENTS.DRIVER_ONLINE, async () => {
      const isPendingOrder = await this.redisService.get(IS_PENDING_ORDER_KEY);
      if (!isPendingOrder || isPendingOrder === 'false') {
        return;
      }
      this.logger.log(`Pending order found, checking for driver...`);

      this.eventEmitter.emit(ORDER_EVENT_ENUM.PENDING_CHECKING);
    });
  }

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
      'state',
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

  /**
   * Retrieves a list of drivers based on the provided filter options.
   *
   * @param {FilterDriverOptionsDto} [options={}] - The filter options to apply to the query.
   * @param {string} [options.name] - The name of the driver to filter by.
   * @param {Date} [options.createdAt] - The creation date to filter by. The query will include drivers created up to the end of the specified day.
   * @param {string} [options.status] - The status of the driver to filter by. Can be 'verified', 'unverified', or 'all'.
   *
   * @returns {Promise<Driver[]>} A promise that resolves to an array of drivers matching the filter criteria.
   */
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
    if (options.status && options.status !== 'all') {
      const isVerified = options.status === 'verified';
      query.andWhere(
        'drivers.isIdentityVerified = :isVerified OR drivers.isAiChecked = :isVerified',
        { isVerified },
      );
    }

    query.select([
      'drivers.id',
      'drivers.name',
      'drivers.phone',
      'drivers.email',
      'drivers.createdAt',
      'drivers.isIdentityVerified',
      'drivers.isAiChecked',
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

  /**
   * Retrieves the profile of a driver by their ID.
   *
   * @param idDriver - The unique identifier of the driver.
   * @returns A promise that resolves to the driver's profile.
   *
   * @throws {BadRequestException} If the driver is not found.
   *
   * @remarks
   * - Logs the process of retrieving the driver's profile.
   * - Checks the cache for the driver's profile before querying the database.
   * - If the profile is found in the cache, it returns the cached profile.
   * - If the profile is not found in the cache, it queries the database.
   * - If the driver is found in the database, it emits an event to cache the profile.
   *
   * @example
   * ```typescript
   * const profile = await meProfile(123);
   * console.log(profile);
   * ```
   */
  async meProfile(idDriver: number) {
    this.logger.log(`Getting profile of driver with id: ${idDriver}`);
    const cache = await this.redisService.get(`driver:${idDriver}`);
    console.log(cache);
    if (cache) {
      this.logger.log(`Cache hit for driver with value: ${cache}`);
      return JSON.parse(cache);
    }
    const found = await this.findById(idDriver, ['transportType'], {
      id: true,
      name: true,
      phone: true,
      email: true,
      balance: true,
      isAiChecked: true,
      state: true,
      idOrder: true,
      isIdentityVerified: true,
      transportType: {
        id: true,
        loadWeight: true,
        code: true,
      },
    });

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
      state: found.state,
      isAiChecked: found.isAiChecked,
      isIdentityVerified: found.isIdentityVerified,
      balance: found.balance,
      idOrder: found.idOrder,
      transportType: found.transportType.code,
      loadWeight: found.transportType.loadWeight,
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

  /**
   * Marks a driver as online and updates their location and state.
   *
   * @param id - The unique identifier of the driver.
   * @param location - The current location of the driver.
   * @param location.lat - The latitude of the driver's location.
   * @param location.lng - The longitude of the driver's location.
   *
   * @returns A promise that resolves to `true` if the operation is successful.
   *
   * @throws {BadRequestException} If the driver is not found or is currently in the delivery state.
   */
  async online(id: number, location: DriverStatusInput) {
    await this.onlineCommand.execute({
      idDriver: id,
      ...location,
    });

    this.eventEmitter.emit(DRIVER_EVENTS.DRIVER_ONLINE);

    return true;
  }

  /**
   * Sets the driver with the given ID to offline status.
   *
   * This method performs the following steps:
   * 1. Logs that the driver is going offline.
   * 2. Finds the driver by ID from the repository.
   * 3. If the driver is not found, logs an error and throws a BadRequestException.
   * 4. If the driver is currently in the delivery state, logs an error and throws a BadRequestException.
   * 5. Updates the driver's state to offline in the repository.
   * 6. Updates the driver's state to offline in the Redis cache.
   *
   * @param {number} id - The ID of the driver to set offline.
   * @returns {Promise<boolean>} - Returns true if the operation is successful.
   * @throws {BadRequestException} - If the driver is not found or is in the delivery state.
   */
  async offline(id: number) {
    await this.offlineCommand.execute({ idDriver: id });

    return true;
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

  calculateDiscountPrice(price: number) {
    const vat = price * RATE_VAT;
    const platformFee = price * RATE_PLATFORM;
    const revenue = price - (vat + platformFee);
    const pit = revenue * RATE_PIT;
    const realRevenue = revenue - pit;

    return {
      platformFee,
      realRevenue,
    };
  }

  updateLocation(id: number, location: DriverStatusInput) {
    this.eventEmitter.emit(
      RedisEvents.UPDATE_VALUE,
      new UpdateCacheValueEvent(`driver:${id}`, {
        lat: location.lat,
        lng: location.lng,
      }),
    );
    return true;
  }
}
