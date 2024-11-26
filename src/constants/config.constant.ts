import { JWT_SECRET_TYPE } from '@decorators';
import { ThrottlerOptions } from '@nestjs/throttler';
type limitType = 'global' | 'login' | 'signedUrl' | 'register';

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
  register: {
    ttl: 60 * 1000,
    limit: 10,
  },
};

export const JWT: Record<JWT_SECRET_TYPE, string> = {
  access: process.env.JWT_SECRET,
  refresh: process.env.JWT_SECRET_REFRESH_TOKEN,
  verify: process.env.JWT_SECRET_VERIFY,
};
