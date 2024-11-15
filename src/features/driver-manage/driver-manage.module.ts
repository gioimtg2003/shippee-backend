import { AdminAuthGuard } from '@features/auth-admin';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { DriverManageController } from './driver-manage.controller';
import { DriverManageService } from './driver-manage.service';

@Module({
  controllers: [DriverManageController],
  providers: [
    DriverManageService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AdminAuthGuard,
    },
  ],
})
export class DriverManageModule {}
