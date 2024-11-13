import { Module } from '@nestjs/common';
import { DriverAuthController } from './driver-auth.controller';
import { DriverAuthService } from './driver-auth.service';

@Module({
  controllers: [DriverAuthController],
  providers: [DriverAuthService],
})
export class DriverAuthModule {}
