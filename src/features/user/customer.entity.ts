import { CoreEntity } from '@common/entities';
import { OrderEntity } from '@features/order/order.entity';
import { Column, Entity, OneToMany, Relation } from 'typeorm';

@Entity('customers')
export class CustomerEntity extends CoreEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column()
  email: string;

  @Column({ type: 'char', length: 12 })
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
