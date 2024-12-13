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
    @Inject(REDIS_MODULE_CONNECTION.CACHE) private readonly client: Redis,
  ) {}

  async get(key: string) {
    this.logger.log(`Getting cache for key: ${key}`);
    return this.client.get(key);
  }

  async getAll<T>(pattern: string) {
    if (!pattern.includes('*')) {
      this.logger.error('Pattern must include *');
      return [];
    }

    this.logger.log(`Getting all cache for pattern: ${pattern}`);

    const keys = await this.client.keys(pattern);
    if (keys.length === 0) {
      this.logger.log(`No keys found for pattern: ${pattern}`);
      return [];
    }

    const values = await this.client.mget(keys);
    this.logger.log(`Found ${values} keys`);
    const records: IRedisRecord<T>[] = [];

    values.map((value, index) => {
      if (value) {
        records.push({ key: keys[index], value: JSON.parse(value) as T });
      }
    });

    return records;
  }

  @OnEvent(RedisEvents.CACHE_VALUE)
  async set(payload: CacheValueEvent) {
    const { key, value } = payload.record;
    const { expires } = payload;

    // Remove the value if it exists
    await this.client.del(key);

    await this.client.set(key, value, 'EX', expires);
    this.logger.log(`Cache set for key ${key}`);
  }

  async updateObject(payload: UpdateCacheValueEvent) {
    const { key, value } = payload;

    this.logger.log(`Updating cache for key: ${key}`);

    // Get the cache
    const cache = await this.client.get(key);
    if (!cache) {
      this.logger.error('Cache not found');
      return;
    }

    // Merge the cache with the new value
    const cacheObj = JSON.parse(cache);
    Object.assign(cacheObj, value);

    const pipeline = this.client.pipeline();
    const ttl = await this.client.ttl(key);

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
