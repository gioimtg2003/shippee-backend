import { DriverModule } from '@features/driver/driver.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverWalletController } from './driver-wallet.controller';
import { DriverWalletService } from './driver-wallet.service';
import { WalletHistoryEntity } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletHistoryEntity]),
    JwtModule,
    DriverModule,
  ],
  controllers: [DriverWalletController],
  providers: [DriverWalletService],
  exports: [DriverWalletService],
})
export class DriverWalletModule {}
