import { CryptoModule } from '@features/crypto';
import { CustomerModule } from '@features/customer/customer.module';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserAuthController } from './customer-auth.controller';
import { CustomerAuthService } from './customer-auth.service';

@Module({
  imports: [CryptoModule, CustomerModule],
  controllers: [UserAuthController],
  providers: [CustomerAuthService, JwtService],
  exports: [CustomerAuthService],
})
export class CustomerAuthModule {}