import { CACHE_TRANSPORT_TYPE } from '@constants';
import { RedisCacheService } from '@features/redis';
import { CacheValueEvent, RedisEvents } from '@features/redis/events';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransportTypeEntity } from './transport-type.entity';

export class TransportTypeService {
  private readonly logger = new Logger(TransportTypeService.name);

  constructor(
    @InjectRepository(TransportTypeEntity)
    private readonly transportType: Repository<TransportTypeEntity>,
    private readonly eventEmitter: EventEmitter2,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async get() {
    this.logger.log('Getting all transport type');
    const cacheValue = await this.redisCacheService.get(
      CACHE_TRANSPORT_TYPE.CACHE_KEY,
    );
    if (cacheValue) {
      this.logger.log('Cache hit for transport type');
      return JSON.parse(cacheValue);
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
}
