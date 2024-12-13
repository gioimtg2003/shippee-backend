import { GoogleAIModule } from '@common/modules/google-ai.module';
import { CloudflareModule } from '@features/cloudflare';
import { CryptoModule } from '@features/crypto';
import { ImageModule } from '@features/image';
import { MailModule } from '@features/mail';
import { RedisModule } from '@features/redis';
import { TransportTypeModule } from '@features/transport-type';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverIdentityService } from './driver-identity.service';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { DriverEntity, DriverIdentityEntity } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([DriverEntity, DriverIdentityEntity]),
    CryptoModule,
    JwtModule,
    CloudflareModule,
    ImageModule,
    CryptoModule,
    GoogleAIModule,
    MailModule,
    RedisModule,
    TransportTypeModule,
  ],
  controllers: [DriverController],
  providers: [DriverService, DriverIdentityService],
  exports: [DriverService, DriverIdentityService],
})
export class DriverModule {}
