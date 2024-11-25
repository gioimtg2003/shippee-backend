import { LIMIT_NAME, PRICE_TYPE_ENUM } from '@constants';
import { Column } from 'typeorm';
import { CoreEntity } from './core.entity';

export class CorePriceEntity extends CoreEntity {
  @Column({ type: 'varchar', length: LIMIT_NAME })
  name: string;

  @Column({ type: 'enum', enum: PRICE_TYPE_ENUM, nullable: true })
  priceType?: PRICE_TYPE_ENUM;

  @Column({ nullable: true })
  priceValue?: number;
}
