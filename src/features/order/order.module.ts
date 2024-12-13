import { ORDER_QUEUE } from '@constants';
import { DriverModule } from '@features/driver';
import { MapBoxService } from '@features/mapbox';
import { OrderStatusModule } from '@features/order-status';
import { RedisModule } from '@features/redis';
import { TransportTypeModule } from '@features/transport-type';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderAssignmentEntity } from './entities/order-assignment.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderAssignmentService } from './order-assignment.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PendingPickupState } from './state';
import { PriceCalculationModule } from './strategies';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderAssignmentEntity]),
    RedisModule,
    DriverModule,
    TransportTypeModule,
    HttpModule,
    OrderStatusModule,
    PriceCalculationModule,
    BullModule.registerQueue({
      name: ORDER_QUEUE.NAME,
    }),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderAssignmentService,
    MapBoxService,
    PendingPickupState,
  ],
  exports: [OrderService, OrderAssignmentService],
})
export class OrderModule {}
