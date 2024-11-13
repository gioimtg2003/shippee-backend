import { CoreEntity } from '@common/entities';
import { LIMIT_NAME, LIMIT_PHONE } from '@constants';
import { OrderEntity } from '@features/order/order.entity';
import { Column, Entity, OneToMany, Relation } from 'typeorm';

@Entity('customers')
export class CustomerEntity extends CoreEntity {
  @Column({ type: 'varchar', length: LIMIT_NAME })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'char', length: LIMIT_PHONE, unique: true, nullable: true })
  phone: string;

  @Column({
    nullable: true,
  })
  province: string;

  @Column({
    nullable: true,
  })
  district: string;

  @Column({
    nullable: true,
  })
  ward: string;

  @Column({
    nullable: true,
  })
  address: string;

  @OneToMany(() => OrderEntity, (order) => order.customer)
  customers: Relation<OrderEntity>[];
}
