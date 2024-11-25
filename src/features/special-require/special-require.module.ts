import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialRequireItemEntity } from './special-require-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpecialRequireItemEntity])],
  controllers: [],
  providers: [],
})
export class SpecialRequireModule {}
