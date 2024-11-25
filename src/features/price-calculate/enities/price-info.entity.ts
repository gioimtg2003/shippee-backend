import { CorePriceEntity } from '@common/entities';
import { TransportTypeEntity } from '@features/transport-type/transport-type.entity';
import { Entity, OneToOne, Relation } from 'typeorm';

@Entity('price_info')
export class PriceInfoEntity extends CorePriceEntity {
  @OneToOne(() => TransportTypeEntity)
  transportType?: Relation<TransportTypeEntity>;
}
