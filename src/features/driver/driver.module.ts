import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { DriverEntity } from './entities/driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DriverEntity])],
  controllers: [DriverController],
  providers: [DriverService],
})
export class DriverModule {}
