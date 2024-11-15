import { AdminAuthGuard } from '@features/auth-admin/guards';
import { CryptoModule } from '@features/crypto';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminEntity } from './entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity]), CryptoModule],
  controllers: [AdminController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AdminAuthGuard,
    },
    AdminService,
  ],
  exports: [AdminService],
})
export class AdminModule {}
