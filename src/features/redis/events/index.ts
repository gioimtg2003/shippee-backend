export * from './cache-value.event';

export enum RedisEvents {
  CACHE_VALUE = 'redis.cache_value',
  UPDATE_VALUE = 'redis.update_value',
}
