import { Module } from '@nestjs/common';
import { AuthAdminController } from './auth-admin.controller';
import { AuthAdminService } from './auth-admin.service';

@Module({
  controllers: [AuthAdminController],
  providers: [AuthAdminService],
})
export class AuthAdminModule {}
