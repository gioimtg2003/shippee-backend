import { CorePriceEntity } from '@common/entities';
import { SPECIAL_REQUIRE_ENUM } from '@constants';
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';

@Entity('special_require_item')
export class SpecialRequireItemEntity extends CorePriceEntity {
  @Column({ type: 'enum', enum: SPECIAL_REQUIRE_ENUM, nullable: true })
  code: SPECIAL_REQUIRE_ENUM;

  @ManyToOne(() => SpecialRequireItemEntity)
  parent?: Relation<SpecialRequireItemEntity>;

  @OneToMany(() => SpecialRequireItemEntity, (item) => item.parent)
  children?: Relation<SpecialRequireItemEntity[]>;
}
