import { ThrottlerOptions } from '@nestjs/throttler';
type limitType = 'global' | 'login';
export const REQUEST_LIMIT_RATE: Record<limitType, ThrottlerOptions> = {
  global: {
    ttl: 15 * 60 * 1000, // 1 second
    limit: 10, // 10 requests
  },
  login: {
    ttl: 15 * 60 * 1000,
    limit: 100, // 5 requests
    // return custom messag
  },
};
