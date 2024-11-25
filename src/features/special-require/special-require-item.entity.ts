import { CorePriceEntity } from '@common/entities';
import { SPECIAL_REQUIRE_ENUM } from '@constants';
import { TransportTypeEntity } from '@features/transport-type/transport-type.entity';
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';

@Entity('special_require_item')
export class SpecialRequireItemEntity extends CorePriceEntity {
  @Column({ type: 'enum', enum: SPECIAL_REQUIRE_ENUM })
  code: SPECIAL_REQUIRE_ENUM;

  @ManyToOne(() => SpecialRequireItemEntity, (item) => item.children)
  parent?: Relation<SpecialRequireItemEntity>;

  @OneToMany(() => SpecialRequireItemEntity, (item) => item.parent)
  children?: Relation<SpecialRequireItemEntity[]>;

  @ManyToOne(() => TransportTypeEntity)
  transportType?: Relation<TransportTypeEntity>;
}
