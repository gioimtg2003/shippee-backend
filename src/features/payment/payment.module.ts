import { DriverWalletModule } from '@features/driver-wallet';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity]), DriverWalletModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
