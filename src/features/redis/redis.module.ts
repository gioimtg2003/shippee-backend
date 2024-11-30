import { REDIS_MODULE_CONNECTION } from '@constants';
import { Global, Module, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import Redis from 'ioredis';
import { RedisCacheService } from './redis-cache.service';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_MODULE_CONNECTION.CACHE,
      useFactory: () => {
        return new Redis(process.env.REDIS_URI);
      },
    },
    RedisCacheService,
  ],
  exports: [RedisCacheService],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onApplicationShutdown(signal?: string) {
    return new Promise<void>((resolve) => {
      const redis = this.moduleRef.get(REDIS_MODULE_CONNECTION.CACHE);

      redis.quit();
      redis.on('end', () => {
        resolve();
      });
    });
  }
}
