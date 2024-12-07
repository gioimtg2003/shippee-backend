import { REDIS_MODULE_CONNECTION } from '@constants';
import { IRedisRecord } from '@interfaces';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import Redis from 'ioredis';
import { CacheValueEvent, RedisEvents } from './events';
import { UpdateCacheValueEvent } from './events/update-value.event';

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

  async getAll<T>(pattern: string) {
    if (!pattern.includes('*')) {
      this.logger.error('Pattern must include *');
      return [];
    }

    this.logger.log(`Getting all cache for pattern: ${pattern}`);

    const keys = await this.redisCache.keys(pattern);
    const values = await this.redisCache.mget(keys);

    const records: IRedisRecord<T>[] = [];

    values.map((value, index) => {
      if (value) {
        records.push({ key: keys[index], value: value as T });
      }
    });

    return records;
  }

  @OnEvent(RedisEvents.CACHE_VALUE)
  async set(payload: CacheValueEvent) {
    const { key, value } = payload.record;
    const { expires } = payload;

    // Remove the value if it exists
    await this.redisCache.del(key);

    await this.redisCache.set(key, value, 'EX', expires);
    this.logger.log(`Cache set for key ${key}`);
  }

  async updateObject(payload: UpdateCacheValueEvent) {
    const { key, value } = payload;

    this.logger.log(`Updating cache for key: ${key}`);

    // Get the cache
    const cache = await this.redisCache.get(key);
    if (!cache) {
      this.logger.error('Cache not found');
      return;
    }

    // Merge the cache with the new value
    const cacheObj = JSON.parse(cache);
    Object.assign(cacheObj, value);

    const pipeline = this.redisCache.pipeline();
    const ttl = await this.redisCache.ttl(key);

    if (ttl > 0) {
      pipeline.set(key, JSON.stringify(cacheObj), 'EX', ttl);
    }

    try {
      await pipeline.exec();
    } catch (error) {
      console.error('Error updating keys:', error);
    }
  }
}
