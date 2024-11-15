import { CryptoModule } from '@features/crypto';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminEntity } from './entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity]), CryptoModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
