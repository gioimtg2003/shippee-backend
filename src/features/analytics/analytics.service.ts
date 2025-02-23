import { CACHE_TIME, KEY_COUNT_DELIVERY, ORDER_STATUS_ENUM } from '@constants';
import { OrderService } from '@features/order/order.service';
import { RedisCacheService } from '@features/redis';
import { CacheValueEvent, RedisEvents } from '@features/redis/events';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getStartAndEndOfMonth, parseJsonSafely } from '@utils';
import dayjs from 'dayjs';
import { Between } from 'typeorm';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    private readonly orderService: OrderService,
    private readonly cacheService: RedisCacheService,
    private readonly emitter: EventEmitter2,
  ) {}

  async getOrders() {
    this.logger.log('Fetching orders');

    const total = await this.orderService.count();
    const pending = await this.orderService.count({
      where: { currentStatus: ORDER_STATUS_ENUM.PENDING },
    });
    const completed = await this.orderService.count({
      where: { currentStatus: ORDER_STATUS_ENUM.COMPLETED },
    });
    const canceled = await this.orderService.count({
      where: { currentStatus: ORDER_STATUS_ENUM.CANCELED },
    });

    const lastMonth = getStartAndEndOfMonth(dayjs().subtract(1, 'month'));
    const currentMonth = getStartAndEndOfMonth(dayjs());

    const firstDayOfLastMonth = lastMonth.start;
    const lastDayOfLastMonth = lastMonth.end;
    const firstDayOfCurrentMonth = currentMonth.start;
    const lastDayOfCurrentMonth = currentMonth.end;

    const cache = await this.cacheService.get(KEY_COUNT_DELIVERY);

    if (cache) {
      const { currentMonthDeliveries, lastMonthDeliveries } =
        parseJsonSafely(cache);
      if (lastMonthDeliveries === 0) {
        return {
          total,
          pending,
          completed,
          canceled,
          percentageChangeDelivery: 100,
        };
      }
      const percentageChangeDelivery =
        ((currentMonthDeliveries - lastMonthDeliveries) / lastMonthDeliveries) *
        100;

      return {
        total,
        pending,
        completed,
        canceled,
        percentageChangeDelivery,
      };
    }

    const currentMonthDeliveries = await this.orderService.count({
      where: {
        createdAt: Between(firstDayOfCurrentMonth, lastDayOfCurrentMonth),
      },
    });
    const lastMonthDeliveries = await this.orderService.count({
      where: {
        createdAt: Between(firstDayOfLastMonth, lastDayOfLastMonth),
      },
    });

    this.emitter.emit(
      RedisEvents.CACHE_VALUE,
      new CacheValueEvent(
        {
          key: KEY_COUNT_DELIVERY,
          value: JSON.stringify({
            currentMonthDeliveries,
            lastMonthDeliveries,
          }),
        },
        CACHE_TIME.ONE_WEEK,
      ),
    );

    const percentageChangeDelivery =
      ((currentMonthDeliveries - lastMonthDeliveries) / lastMonthDeliveries) *
      100;

    return {
      total,
      pending,
      completed,
      canceled,
      percentageChangeDelivery,
    };
  }
}
