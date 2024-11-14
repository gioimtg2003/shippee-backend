import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './admin.entity';
import { AuthAdminController } from './auth-admin.controller';
import { AuthAdminService } from './auth-admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity])],
  controllers: [AuthAdminController],
  providers: [AuthAdminService],
})
export class AuthAdminModule {}
