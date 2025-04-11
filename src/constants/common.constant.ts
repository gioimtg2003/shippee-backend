export const EXPIRES_ACCESS_TOKEN = 1800;
export const EXPIRES_REFRESH_TOKEN = 86400;
export const EXPIRES_TOKEN_ADMIN_AUTH = 28800;

export const LIMIT_NAME = 60;
export const LIMIT_PHONE = 12;
export const LIMIT_NUMBER_ID = 12;
export const LIMIT_URL_IMG = 100;

export const LIMIT_PASSWORD = 6;

export enum PRICE_TYPE_ENUM {
  FIXED = 'FIXED',
  PERCENT = 'PERCENT',
}

export enum JWT_TYPE_ENUM {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
  VERIFY = 'VERIFY',
}

export const CACHE_TIME = {
  ONE_MINUTE: 60,
  ONE_HOUR: 60 * 60,
  TWO_HOUR: 60 * 60 * 2,
  THREE_HOUR: 60 * 60 * 3,
  FOUR_HOUR: 60 * 60 * 4,
  FIVE_HOUR: 60 * 60 * 5,
  SIX_HOUR: 60 * 60 * 6,
  SEVEN_HOUR: 60 * 60 * 7,
  EIGHT_HOUR: 60 * 60 * 8,
  NINE_HOUR: 60 * 60 * 9,
  TEN_HOUR: 60 * 60 * 10,
  ELEVEN_HOUR: 60 * 60 * 11,
  TWELVE_HOUR: 60 * 60 * 12,
  ONE_DAY: 60 * 60 * 24,
  ONE_WEEK: 60 * 60 * 24 * 7,
};

export const ERRORS = {
  TokenExpiredError: 'TokenExpiredError',
  Unauthorized: 'Unauthorized',
  MissingToken: 'Please provide token',
  TokenInvalid: 'Token has been invalidated',
  RefreshTokenNotMatching: 'CODE_RefreshTokenIncorrect',
};
