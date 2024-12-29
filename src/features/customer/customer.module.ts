import { CryptoModule } from '@features/crypto';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { CustomerEntity } from './customer.entity';
import { CustomerService } from './customer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity]),
    JwtModule,
    CryptoModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
