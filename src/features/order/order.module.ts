import { DriverModule } from '@features/driver';
import { MapBoxService } from '@features/mapbox';
import { RedisModule } from '@features/redis';
import { TransportTypeModule } from '@features/transport-type';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderAssignmentEntity } from './entities/order-assignment.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderAssignmentService } from './order-assignment.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderAssignmentEntity]),
    RedisModule,
    DriverModule,
    TransportTypeModule,
    HttpModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderAssignmentService, MapBoxService],
  exports: [OrderService, OrderAssignmentService],
})
export class OrderModule {}
