import { CryptoModule } from '@features/crypto';
import { RedisModule } from '@features/redis';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { VietinbankController } from './vietinbank.controller';
import { VietinbankService } from './Vietinbank.service';

@Module({
  imports: [HttpModule, RedisModule, CryptoModule],
  controllers: [VietinbankController],
  providers: [VietinbankService],
  exports: [VietinbankService],
})
export class BankModule {}
