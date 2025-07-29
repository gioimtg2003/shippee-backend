export const NOTE_MAX_LENGTH = 255;

export enum ORDER_STATUS_ENUM {
  PENDING = 'PENDING',
  PENDING_PICKUP = 'PENDING_PICKUP',
  PICKED_UP = 'PICKED_UP',
  COMPLETED = 'COMPLETED',
  RETURN = 'RETURN',
  RETURNING = 'RETURNING',
  RETURNED = 'RETURNED',
  CANCELED = 'CANCELED',
  RELEASE = 'RELEASE',
  ARRIVED_AT_PICKUP = 'ARRIVED_AT_PICKUP',
  ARRIVED_AT_RECIPIENT = 'ARRIVED_AT_RECIPIENT',
}

export enum ORDER_PAYER_ENUM {
  SENDER = 'SENDER',
  RECIPIENT = 'RECIPIENT',
}

export enum ORDER_TYPE {
  TWO_HOURS,
  FAST_DELIVERY,
}

export enum ORDER_ASSIGNMENT_STATUS_ENUM {
  ASSIGNED = 'ASSIGNED',
  REJECTED = 'REJECTED',
  EXPIRE = 'EXPIRE',
}

export const MAX_DISTANCE = 3000; // 3 km
export const IS_PENDING_ORDER_KEY = 'is_pending_order';
export const EXPIRE_CACHE_PENDING_ORDER = 60 * 60 * 24; // 1 day
export const KEY_COUNT_DELIVERY = 'count_delivery';

export const OrderDress = [
  {
    address: '475A Điện Biên Phủ, Phường 25, Bình Thạnh, Hồ Chí Minh, Việt Nam',
    lat: 10.8014959,
    lng: 106.710643,
  },
  {
    address:
      '215 Điện Biên Phủ, Phường 15, Bình Thạnh, Hồ Chí Minh 700000, Việt Nam',
    lat: 10.8014885,
    lng: 106.7050138,
  },
  {
    address: '1 Đ. Cộng Hòa, Phường 4, Tân Bình, Hồ Chí Minh, Việt Nam',
    lat: 10.8000693,
    lng: 106.6557954,
  },
  {
    address: '20 Đ. Cộng Hòa, Phường 12, Tân Bình, Hồ Chí Minh, Việt Nam',
    lat: 10.7997639,
    lng: 106.6540381,
  },
  {
    address:
      '639 Phạm Văn Bạch, Phường 15, Tân Bình, Hồ Chí Minh 700000, Việt Nam',
    lat: 10.8281366,
    lng: 106.6409166,
  },
  {
    address: '367 Tây Thạnh, P, Tân Phú, Hồ Chí Minh 00700, Việt Nam',
    lat: 10.8101525,
    lng: 106.6190555,
  },
  {
    address:
      'Lotte Mart, 469 Đ. Nguyễn Hữu Thọ, Tân Hưng, Quận 7, Hồ Chí Minh 700000, Việt Nam',
    lat: 10.7430771,
    lng: 106.67746,
  },
  {
    address: 'Khu đô thị mới Thủ Thiêm, Quận 2, Thành phố Hồ Chí Minh',
    lat: 10.7815381,
    lng: 106.7013699,
  },
  {
    address: 'Cao Đẳng Công Thương TP.HCM',
    lat: 10.8234323,
    lng: 106.7682336,
  },
  {
    address:
      '159 Đỗ Xuân Hợp, Phước Long B, Quận 9, Hồ Chí Minh 700000, Việt Nam',
    lat: 10.8277244,
    lng: 106.7743649,
  },
  {
    address: '81 Đ. 109, Phước Long B, Quận 9, Hồ Chí Minh 700000, Việt Nam',
    lat: 10.8238155,
    lng: 106.7722749,
  },
  {
    address: '200 Dương Đình Hội, Phước Long B, Quận 9, Hồ Chí Minh, Việt Nam',
    lat: 10.8271186,
    lng: 106.7783408,
  },
  {
    address:
      '10 Đ. Trần Thị Điệu, Phước Long B, Quận 9, Hồ Chí Minh 70000, Việt Nam',
    lat: 10.8297682,
    lng: 106.772059,
  },
];

export enum PRICE_ITEMS_ENUM {
  DEFAULT = 'DEFAULT',
  EXCEED = 'EXCEED',
}

export enum ORDER_QUEUE {
  NAME = 'order_queue',
  ASSIGN = 'assign_order',
  PENDING_CHECKING = 'pending_checking',
  PICKUP_CHECKING = 'pickup_checking',
}

export const RATE_PIT = 0.15;
export const RATE_VAT = 0.1;
export const RATE_PLATFORM = 0.1;
