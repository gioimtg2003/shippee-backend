import { CryptoModule } from '@features/crypto';
import { RedisModule } from '@features/redis';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportTypeController } from './transport-type.controller';
import { TransportTypeEntity } from './transport-type.entity';
import { TransportTypeService } from './transport-type.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransportTypeEntity]),
    CryptoModule,
    RedisModule,
  ],
  controllers: [TransportTypeController],
  providers: [TransportTypeService],
  exports: [TransportTypeService],
})
export class TransportTypeModule {}
