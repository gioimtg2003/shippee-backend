import { ORDER_STATUS_ENUM } from '@constants';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatusEntity } from './order-status.entity';

@Injectable()
export class OrderStatusService {
  private readonly logger = new Logger(OrderStatusService.name);

  constructor(
    @InjectRepository(OrderStatusEntity)
    private readonly repo: Repository<OrderStatusEntity>,
  ) {}

  /**
   * Creates a new order status entry in the repository.
   *
   * @param data - An object containing the order ID and the status.
   * @param data.orderId - The ID of the order.
   * @param data.status - The status of the order, represented by the ORDER_STATUS_ENUM.
   * @returns The saved order status entry.
   * @throws Will throw an error if the creation or saving of the order status fails.
   */
  async create(data: { orderId: number; status: ORDER_STATUS_ENUM }) {
    const created = this.repo.create({
      ...data,
      order: { id: data.orderId },
    });

    if (!created) {
      this.logger.error('Failed to create order status');
      throw new Error('Failed to create order status');
    }

    const saved = await this.repo.save(created);

    if (!saved) {
      this.logger.error('Failed to save order status');
      throw new Error('Failed to save order status');
    }

    return saved;
  }
}
