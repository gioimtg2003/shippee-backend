export type TRANSPORT_TYPE = 'scooter' | 'truck' | 'car';

export enum TRANSPORT_TYPE_ENUM {
  BIKE = 'BIKE',
  VAN_500 = 'VAN_500',
  VAN_1T = 'VAN_1T',
  TRUCK_1T = 'TRUCK_1T',
  TRUCK_1T5 = 'TRUCK_1T5',
  TRUCK_2T = 'TRUCK_2T',
}

export const TRANSPORT_TYPE = {
  LIMIT_NAME: 40,
  LIMIT_ICON: 100,
  LIMIT_DESCRIPTION: 255,
};

export const CACHE_TRANSPORT_TYPE = {
  CACHE_KEY: 'CACHE_TRANSPORT_TYPE',
  TTL: 86400, // 1 day
};
