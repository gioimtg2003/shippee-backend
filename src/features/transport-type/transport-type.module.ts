import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportTypeEntity } from './transport-type.entity';
import { TransportTypeService } from './transport-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransportTypeEntity])],
  providers: [TransportTypeService],
  exports: [TransportTypeService],
})
export class TransportTypeModule {}
