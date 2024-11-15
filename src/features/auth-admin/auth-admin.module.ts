import { AdminModule } from '@features/admin';
import { CryptoModule } from '@features/crypto';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthAdminController } from './auth-admin.controller';
import { AuthAdminService } from './auth-admin.service';

@Module({
  imports: [AdminModule, CryptoModule],
  controllers: [AuthAdminController],
  providers: [AuthAdminService, JwtService],
})
export class AuthAdminModule {}
