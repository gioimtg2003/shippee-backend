import { DriverModule } from '@features/driver';
import { RedisModule } from '@features/redis';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), RedisModule, DriverModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
