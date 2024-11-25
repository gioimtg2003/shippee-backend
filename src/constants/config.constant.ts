import { ThrottlerOptions } from '@nestjs/throttler';
type limitType = 'global' | 'login' | 'signedUrl';

export const REQUEST_LIMIT_RATE: Record<limitType, ThrottlerOptions> = {
  global: {
    // 10 request per second
    ttl: 1000,
    limit: 10,
  },
  login: {
    ttl: 15 * 60 * 1000,
    limit: 10,
  },
  signedUrl: {
    ttl: 15 * 1000,
    limit: 2,
  },
};
