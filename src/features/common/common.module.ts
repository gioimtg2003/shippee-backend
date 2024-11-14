import { TransportTypeEntity } from '@common/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TransportTypeEntity])],
  controllers: [],
  providers: [],
})
export class CommonModule {}
