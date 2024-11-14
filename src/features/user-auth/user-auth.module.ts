import { CryptoModule } from '@features/crypto';
import { UserModule } from '@features/user/user.module';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';

@Module({
  imports: [CryptoModule, UserModule],
  controllers: [UserAuthController],
  providers: [UserAuthService, JwtService],
  exports: [UserAuthService],
})
export class UserAuthModule {}
