import { CoreEntity } from '@common/entities';
import { LIMIT_NAME, LIMIT_PHONE } from '@constants';
import { OrderEntity } from '@features/order/entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, Relation } from 'typeorm';

@Entity('customers')
export class CustomerEntity extends CoreEntity {
  @Column({ type: 'varchar', length: LIMIT_NAME })
  @ApiProperty()
  name: string;

  @Column({ unique: true })
  @ApiProperty()
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty()
  password: string;

  @Column({ type: 'char', length: LIMIT_PHONE, unique: true, nullable: true })
  @ApiProperty()
  phone: string;

  @Column({
    nullable: true,
  })
  @ApiProperty()
  province: string;

  @Column({
    nullable: true,
  })
  @ApiProperty()
  district: string;

  @Column({
    nullable: true,
  })
  @ApiProperty()
  ward: string;

  @Column({
    nullable: true,
  })
  @ApiProperty()
  address: string;

  @Column({ type: 'boolean', default: false })
  @ApiProperty()
  emailVerified: boolean;

  @Column({ type: 'char', length: 6, nullable: true })
  @ApiProperty()
  otp: string;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty()
  timeOtp: Date;

  @OneToMany(() => OrderEntity, (order) => order.customer)
  orders: Relation<OrderEntity[]>;
}
