import { CoreEntity } from '@common/entities';
import { LIMIT_NAME, LIMIT_PHONE } from '@constants';
import { OrderEntity } from '@features/order/entities/order.entity';
import { Column, Entity, OneToMany, Relation } from 'typeorm';

@Entity('customers')
export class CustomerEntity extends CoreEntity {
  @Column({ type: 'varchar', length: LIMIT_NAME })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

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

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'char', length: 6, nullable: true })
  otp: string;

  @OneToMany(() => OrderEntity, (order) => order.customer)
  orders: Relation<OrderEntity[]>;
}
