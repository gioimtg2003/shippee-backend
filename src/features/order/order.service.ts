import {
  IS_PENDING_ORDER_KEY,
  ORDER_STATUS_ENUM,
  OrderDress,
  PRICE_ITEMS_ENUM,
} from '@constants';
import { MapBoxService } from '@features/mapbox';
import { RedisCacheService } from '@features/redis';
import { TransportTypeService } from '@features/transport-type/transport-type.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CalculateDistance,
  calculatePriceInfo,
  exceedDistancePrice,
  formatDateToUTCString,
  sample,
} from '@utils';
import { FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { CreateOrderInput } from './dto';
import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(OrderEntity)
    private readonly repo: Repository<OrderEntity>,
    private readonly redisService: RedisCacheService,
    private readonly transportTypeService: TransportTypeService,
    private readonly mapBoxService: MapBoxService,
  ) {}

  findByField(
    where: FindOptionsWhere<OrderEntity>,
    relations: string[] = [],
    select?: FindOptionsSelect<OrderEntity>,
  ) {
    return this.repo.findOne({ where, relations, select });
  }

  findById(id: number, relations: string[] = []) {
    return this.findByField({ id }, relations);
  }

  findByDriverId(driverId: number, relations: string[] = []) {
    return this.repo.find({
      where: {
        driver: { id: driverId },
      },
      relations,
    });
  }

  async create(data: Partial<OrderEntity>) {
    const created = this.repo.create(data);
    if (!created) {
      this.logger.error('Failed to create order');
      throw new BadRequestException('Failed to create order');
    }

    const saved = await this.repo.save(created);

    if (!saved.id) {
      this.logger.error('Failed to save order');
      throw new BadRequestException('Failed to save order');
    }
    this.logger.log(`Order created: ${saved.id}`);
    return saved;
  }

  async handleCreate(data: CreateOrderInput) {
    const {
      pickup,
      destination,
      startTime,
      endTime,
      cod,
      cusName,
      cusPhone,
      recipientName,
      recipientPhone,
      idCustomer,
      idTransportType,
      isDeliveryCharge,
      note,
    } = data;

    const distance = await this.mapBoxService.getDistance(
      [pickup.lat, pickup.lng],
      [destination.lat, destination.lng],
    );
    const distanceKm = Math.ceil(distance.routes[0].distance / 1000);

    const { defaultPrice, exceedDistance, exceedPrice } =
      await this.calculateExceedDistance(distanceKm, idTransportType);

    const priceItems = this.createPriceItems(
      defaultPrice,
      exceedDistance,
      exceedPrice,
    );

    const totalPrice = priceItems.reduce((acc, item) => acc + item.price, 0);
    const order = {
      distanceTotal: distanceKm,
      priceItems,
      totalPrice,
      exceedDistance,
      deliveryWindow:
        startTime && endTime
          ? `[${formatDateToUTCString(startTime)}, ${formatDateToUTCString(endTime)})`
          : null,
    };

    const created = this.repo.create({
      ...order,
      cod,
      cusName,
      cusPhone,
      recipientName,
      recipientPhone,
      customer: { id: idCustomer },
      pickup,
      destination,
      note: note || '',
      isDeliveryCharge,
      transportType: { id: idTransportType },
    });

    if (!created) {
      this.logger.error('Failed to create order');
      throw new BadRequestException('Failed to create order');
    }

    const saved = await this.repo.save(created);

    if (!saved.id) {
      this.logger.error('Failed to save order');
      throw new BadRequestException('Failed to save order');
    }

    this.logger.log(`Order created: ${saved.id}`);
    return saved;
  }

  private createPriceItems(
    defaultPrice: number,
    exceedDistance: number,
    exceedPrice: number,
  ) {
    const priceItems = [
      {
        name: PRICE_ITEMS_ENUM.DEFAULT,
        price: defaultPrice,
      },
    ];

    if (exceedDistance > 0) {
      priceItems.push({
        name: PRICE_ITEMS_ENUM.EXCEED,
        price: exceedPrice,
      });
    }

    return priceItems;
  }

  async calculateExceedDistance(
    distanceTotal: number,
    idTransportType: number,
  ) {
    const transport =
      await this.transportTypeService.getPriceInfo(idTransportType);

    if (!transport) {
      this.logger.error('Transport type not found');
      throw new BadRequestException('Transport type not found');
    }

    const exceedValue = exceedDistancePrice(
      distanceTotal,
      transport.exceedSegmentPrices,
    );
    const exceedDistance =
      distanceTotal - transport.exceedSegmentPrices[0].startExtraDistanceKm;
    const exceedPrice = exceedValue * exceedDistance;

    const defaultPrice = calculatePriceInfo(
      transport.priceInfo.priceType,
      transport.priceInfo.priceValue,
    );

    return { exceedDistance, exceedPrice, defaultPrice };
  }

  async update(id: number, data: Partial<OrderEntity>) {
    const order = await this.findById(id);
    if (!order) {
      this.logger.error('Order not found');
      throw new BadRequestException('Order not found');
    }
    Object.assign(order, data);

    const updated = await this.repo.save(order);
    if (!updated) {
      this.logger.error('Failed to update order');
      throw new BadRequestException('Failed to update order');
    }
    this.logger.log(`Order updated: ${updated.id}`);
    return updated;
  }

  checkOrderNotAssigned() {
    return this.redisService.get(IS_PENDING_ORDER_KEY);
  }

  getOrderPending() {
    return this.repo.find({
      where: {
        potentialDriverId: null,
        currentStatus: ORDER_STATUS_ENUM.PENDING,
      },
      order: {
        createdAt: 'ASC',
      },
      take: 1,
      skip: 0,
      select: {
        id: true,
      },
    });
  }

  async createBulk() {
    const pickup = sample(OrderDress);
    const destination = sample(OrderDress);

    const distance = CalculateDistance(
      pickup.lat,
      pickup.lng,
      destination.lat,
      destination.lng,
    );
    const distanceKm = Math.floor(Number(distance) / 1000);

    const order = {
      cusName: 'Nguyen Cong Gioi',
      customer: { id: 1 },
      pickup: {
        address: pickup.address,
        coordinates: [pickup.lat, pickup.lng],
      },
      cusPhone: '0367093723',
      recipientName: 'Nguyen Cong Gioi - 2',
      destination: {
        address: destination.address,
        coordinates: [destination.lat, destination.lng],
      },
      distanceTotal: distanceKm,
    };
  }
}
