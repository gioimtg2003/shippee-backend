import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderStatusController } from './order-status.controller';
import { OrderStatusEntity } from './order-status.entity';
import { OrderStatusService } from './order-status.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderStatusEntity])],
  controllers: [OrderStatusController],
  providers: [OrderStatusService],
})
export class OrderStatusModule {}
