import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverWalletController } from './driver-wallet.controller';
import { DriverWalletService } from './driver-wallet.service';
import { WalletHistoryEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([WalletHistoryEntity])],
  controllers: [DriverWalletController],
  providers: [DriverWalletService],
})
export class DriverWalletModule {}
