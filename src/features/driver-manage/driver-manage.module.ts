import { DriverModule } from '@features/driver/driver.module';
import { ImageModule } from '@features/image/image.module';
import { MailModule } from '@features/mail';
import { TransportTypeModule } from '@features/transport-type';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DriverManageController } from './driver-manage.controller';
import { DriverManageService } from './driver-manage.service';

@Module({
  imports: [DriverModule, MailModule, ImageModule, TransportTypeModule],
  controllers: [DriverManageController],
  providers: [DriverManageService, JwtService],
})
export class DriverManageModule {}
