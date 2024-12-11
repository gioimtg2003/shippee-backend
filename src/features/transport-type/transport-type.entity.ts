import { CoreEntity } from '@common/entities';
import { TRANSPORT_TYPE, TRANSPORT_TYPE_ENUM } from '@constants';
import { DriverEntity } from '@features/driver/entities/driver.entity';
import { OrderEntity } from '@features/order/entities/order.entity';
import { ExceedSegmentPriceEntity } from '@features/price-calculate/enities/exceed-segment-price.entity';
import { PriceInfoEntity } from '@features/price-calculate/enities/price-info.entity';
import { SpecialRequireItemEntity } from '@features/special-require/special-require-item.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';

@Entity('transport_types')
export class TransportTypeEntity extends CoreEntity {
  @Column({ type: 'varchar', length: TRANSPORT_TYPE.LIMIT_NAME })
  name: string;

  @Column({ type: 'varchar', length: TRANSPORT_TYPE.LIMIT_ICON })
  imageUrl: string;

  @Column({ length: TRANSPORT_TYPE.LIMIT_DESCRIPTION })
  description: string;

  @Column({ type: 'enum', enum: TRANSPORT_TYPE_ENUM })
  code: TRANSPORT_TYPE_ENUM;

  @Column()
  loadWeight: number;

  @Column()
  textWeight: string;

  @Column()
  textSize: string;

  @OneToMany(() => ExceedSegmentPriceEntity, (e) => e.transportType)
  exceedSegmentPrices: Relation<ExceedSegmentPriceEntity[]>;

  @OneToMany(() => DriverEntity, (driver) => driver.transportType)
  driver: Relation<DriverEntity[]>;

  @OneToMany(
    () => SpecialRequireItemEntity,
    (specReqItem) => specReqItem.transportType,
  )
  specialRequireItems: Relation<SpecialRequireItemEntity[]>;

  @OneToOne(() => PriceInfoEntity, (priceInfo) => priceInfo.transportType)
  @JoinColumn()
  priceInfo: Relation<PriceInfoEntity>;

  @OneToMany(() => OrderEntity, (e) => e.transportType)
  orders: Relation<OrderEntity[]>;
}
