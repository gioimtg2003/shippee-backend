import { CloudflareModule } from '@features/cloudflare';
import { CryptoModule } from '@features/crypto';
import { ImageModule } from '@features/image';
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
  ],
  controllers: [DriverController],
  providers: [DriverService, DriverIdentityService],
  exports: [DriverService, DriverIdentityService],
})
export class DriverModule {}
