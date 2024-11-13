import { Module } from '@nestjs/common';
import { DriverWalletService } from './driver-wallet.service';
import { DriverWalletController } from './driver-wallet.controller';

@Module({
  controllers: [DriverWalletController],
  providers: [DriverWalletService],
})
export class DriverWalletModule {}
