import { CryptoModule } from '@features/crypto';
import { RedisModule } from '@features/redis';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { VietinbankService } from './Vietinbank.service';
import { VietinbankController } from './vietinbank.controller';

@Module({
  imports: [HttpModule, RedisModule, CryptoModule],
  controllers: [VietinbankController],
  providers: [VietinbankService],
  exports: [VietinbankService],
})
export class BankModule {}
