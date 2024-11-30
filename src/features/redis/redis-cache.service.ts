import { REDIS_MODULE_CONNECTION } from '@constants';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import Redis from 'ioredis';
import { CacheValueEvent, RedisEvents } from './events';

@Injectable()
export class RedisCacheService {
  private logger = new Logger(RedisCacheService.name);

  constructor(
    @Inject(REDIS_MODULE_CONNECTION.CACHE) private readonly redisCache: Redis,
  ) {}

  async get(key: string) {
    this.logger.log(`Getting cache for key: ${key}`);
    return this.redisCache.get(key);
  }

  @OnEvent(RedisEvents.CACHE_VALUE)
  async set(payload: CacheValueEvent) {
    const { key, value } = payload.record;
    const { expires } = payload;
    await this.redisCache.set(key, value, 'EX', expires);
    this.logger.log(`Cache set for key ${key}`);
  }
}
