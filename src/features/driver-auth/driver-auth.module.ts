import { CryptoModule } from '@features/crypto';
import { DriverModule } from '@features/driver/driver.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DriverAuthController } from './driver-auth.controller';
import { DriverAuthService } from './driver-auth.service';

@Module({
  imports: [DriverModule, CryptoModule, JwtModule],
  controllers: [DriverAuthController],
  providers: [DriverAuthService],
})
export class DriverAuthModule {}
