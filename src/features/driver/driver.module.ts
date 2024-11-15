import { CryptoModule } from '@features/crypto';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { DriverEntity, DriverIdentityEntity } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([DriverEntity, DriverIdentityEntity]),
    CryptoModule,
  ],
  controllers: [DriverController],
  providers: [DriverService],
  exports: [DriverService],
})
export class DriverModule {}
