import { DriverModule } from '@features/driver/driver.module';
import { MailModule } from '@features/mail';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DriverManageController } from './driver-manage.controller';
import { DriverManageService } from './driver-manage.service';

@Module({
  imports: [DriverModule, MailModule],
  controllers: [DriverManageController],
  providers: [DriverManageService, JwtService],
})
export class DriverManageModule {}