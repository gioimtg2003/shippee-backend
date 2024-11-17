import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DriverManageController } from './driver-manage.controller';
import { DriverManageService } from './driver-manage.service';

@Module({
  controllers: [DriverManageController],
  providers: [DriverManageService, JwtService],
})
export class DriverManageModule {}
