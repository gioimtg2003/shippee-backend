import { GoogleAIModule } from '@common/modules/google-ai.module';
import { CloudflareModule } from '@features/cloudflare';
import { CryptoModule } from '@features/crypto';
import { ImageModule } from '@features/image';
import { MailModule } from '@features/mail';
import { MapBoxService } from '@features/mapbox';
import { OrderAssignmentEntity } from '@features/order/entities/order-assignment.entity';
import { OrderEntity } from '@features/order/entities/order.entity';
import { OrderAssignmentService } from '@features/order/order-assignment.service';
import { OrderService } from '@features/order/order.service';
import { RedisModule } from '@features/redis';
import { TransportTypeModule } from '@features/transport-type';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverIdentityService } from './driver-identity.service';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { DriverEntity, DriverIdentityEntity } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DriverEntity,
      DriverIdentityEntity,
      OrderEntity,
      OrderAssignmentEntity,
    ]),
    CryptoModule,
    JwtModule,
    CloudflareModule,
    ImageModule,
    CryptoModule,
    GoogleAIModule,
    MailModule,
    RedisModule,
    TransportTypeModule,
    HttpModule,
  ],
  controllers: [DriverController],
  providers: [
    DriverService,
    DriverIdentityService,
    OrderService,
    OrderAssignmentService,
    MapBoxService,
  ],
  exports: [DriverService, DriverIdentityService],
})
export class DriverModule {}
