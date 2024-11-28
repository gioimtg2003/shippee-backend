import { ThrottlerOptions } from '@nestjs/throttler';
import { JWT_TYPE_ENUM } from './common.constant';
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

export const JWT: { [key in JWT_TYPE_ENUM]: string } = {
  [JWT_TYPE_ENUM.ACCESS]: process.env.JWT_SECRET,
  [JWT_TYPE_ENUM.REFRESH]: process.env.JWT_SECRET_REFRESH_TOKEN,
  [JWT_TYPE_ENUM.VERIFY]: process.env.JWT_SECRET_VERIFY_EMAIL,
};
