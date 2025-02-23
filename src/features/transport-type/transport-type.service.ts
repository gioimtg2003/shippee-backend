import { CACHE_TRANSPORT_TYPE } from '@constants';
import { RedisCacheService } from '@features/redis';
import { CacheValueEvent, RedisEvents } from '@features/redis/events';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { parseJsonSafely } from '@utils';
import { FindOneOptions, Repository } from 'typeorm';
import { TransportTypeEntity } from './transport-type.entity';

export class TransportTypeService {
  private readonly logger = new Logger(TransportTypeService.name);

  constructor(
    @InjectRepository(TransportTypeEntity)
    private readonly transportType: Repository<TransportTypeEntity>,
    private readonly eventEmitter: EventEmitter2,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  /**
   * Retrieves all transport types from the cache or database.
   *
   * This method first attempts to retrieve the transport types from the cache.
   * If the cache contains the data, it returns the cached value.
   * If the cache does not contain the data, it retrieves the transport types from the database,
   * stores the retrieved data in the cache, and then returns the data.
   *
   * @returns {Promise<any>} A promise that resolves to the list of transport types.
   */
  async get() {
    this.logger.log('Getting all transport type');
    const cacheValue = await this.redisCacheService.get(
      CACHE_TRANSPORT_TYPE.CACHE_KEY,
    );
    if (cacheValue) {
      this.logger.log('Cache hit for transport type');
      return parseJsonSafely(cacheValue);
    }

    this.logger.log('Cache miss for transport type');
    const transportTypes = await this.transportType.find();

    this.eventEmitter.emit(
      RedisEvents.CACHE_VALUE,
      new CacheValueEvent(
        {
          key: CACHE_TRANSPORT_TYPE.CACHE_KEY,
          value: JSON.stringify(transportTypes),
        },
        CACHE_TRANSPORT_TYPE.TTL,
      ),
    );

    return transportTypes;
  }

  findById(id: number) {
    return this.transportType.findOne({
      where: { id },
    });
  }

  findByField(options: FindOneOptions<TransportTypeEntity>) {
    return this.transportType.findOne(options);
  }

  getPriceInfo(id: number) {
    return this.transportType
      .createQueryBuilder('transport_types')
      .leftJoinAndSelect(
        'transport_types.exceedSegmentPrices',
        'exceed_segment_price',
      )
      .leftJoinAndSelect('transport_types.priceInfo', 'price_info')
      .where('transport_types.id = :id', { id })
      .select([
        'transport_types.id',
        'transport_types.loadWeight',
        'price_info.id',
        'price_info.priceValue',
        'price_info.priceType',
        'exceed_segment_price.endExtraDistanceKm',
        'exceed_segment_price.priceExtra',
        'exceed_segment_price.startExtraDistanceKm',
      ])
      .getOne();
  }
}
