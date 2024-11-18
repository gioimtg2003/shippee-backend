import { DriverModule } from '@features/driver/driver.module';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DriverManageController } from './driver-manage.controller';
import { DriverManageService } from './driver-manage.service';

@Module({
  imports: [DriverModule],
  controllers: [DriverManageController],
  providers: [DriverManageService, JwtService],
})
export class DriverManageModule {}
