import { DriverSession } from '@common/dto';
import { OrderService } from '@features/order/order.service';
import { RedisCacheService } from '@features/redis';
import { Injectable, Logger } from '@nestjs/common';
import { LessThanOrEqual } from 'typeorm';
import { PickOrderCommand } from './command';
import { ArrivedPickupOrderCommand } from './command/arrived-pickup-order.command';
import { ArrivedRecipientCommand } from './command/arrived-recipient.command';
import { DeliveryCompletedCommand } from './command/delivery-completed.command';
import { PickedOrderCommand } from './command/picked.order.command';
import { OrderCompletedInput } from './dto/order-completed.input';

@Injectable()
export class DriverOrderService {
  private readonly logger = new Logger(DriverOrderService.name);
  constructor(
    private readonly orderService: OrderService,
    private readonly cacheService: RedisCacheService,
    private readonly pickOrderCommand: PickOrderCommand,
    private readonly arrivedPickupOrderCommand: ArrivedPickupOrderCommand,
    private readonly pickedOrderCommand: PickedOrderCommand,
    private readonly arrivedRecipientCommand: ArrivedRecipientCommand,
    private readonly deliveryCompletedCommand: DeliveryCompletedCommand,
  ) {}

  async getOrderPending(driver: DriverSession) {
    this.logger.log(`Get order pending for driver ${driver.id}`);
    const driverSession = await this.cacheService.get(`driver:${driver.id}`);
    const driverObject = JSON.parse(driverSession);

    return this.orderService.getOrderPending(
      {
        loadWeight: LessThanOrEqual(driverObject['loadWeight']),
      },
      {
        id: true,
        pickup: { address: true, coordinates: true },
        destination: { address: true, coordinates: true },
        totalPrice: true,
      },
    );
  }

  async pickupOrder(driver: DriverSession, orderId: number) {
    this.logger.log(`Pick up order ${orderId} for driver ${driver.id}`);
    await this.pickOrderCommand.execute({
      idDriver: driver.id,
      idOrder: orderId,
    });

    return true;
  }

  getOrderPendingDetail(orderId: number) {
    return this.orderService.findById(orderId);
  }

  async getOrderDetailDelivery(orderId: number, idDriver: number) {
    this.logger.log(`Get order detail delivery for driver ${idDriver}`);
    return this.orderService.findByField({
      id: orderId,
      driver: { id: idDriver },
      potentialDriverId: idDriver,
    });
  }

  async arrivedPickup(driver: DriverSession) {
    this.logger.log(`Arrived at destination for driver ${driver.id}`);
    await this.arrivedPickupOrderCommand.execute({
      idDriver: driver.id,
      idOrder: driver.idOrder,
    });

    return true;
  }

  async pickedOrder(driver: DriverSession) {
    this.logger.log(`Picked Order for driver ${driver.id}`);
    await this.pickedOrderCommand.execute({
      idDriver: driver.id,
      idOrder: driver.idOrder,
    });

    return true;
  }

  async arrivedRecipient(driver: DriverSession) {
    this.logger.log(`Arrived at recipient for driver ${driver.id}`);
    await this.arrivedRecipientCommand.execute({
      idDriver: driver.id,
      idOrder: driver.idOrder,
    });

    return true;
  }

  async deliveryCompleted(driver: DriverSession, input: OrderCompletedInput) {
    const { imgDelivered } = input;

    this.logger.log(`Delivery completed for driver ${driver.id}`);
    await this.deliveryCompletedCommand.execute({
      idDriver: driver.id,
      idOrder: driver.idOrder,
      imgDelivered,
    });

    return true;
  }
}
