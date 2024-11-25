import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('order_details')
export class OrderDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
