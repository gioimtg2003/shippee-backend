import { Column, Entity } from 'typeorm';

@Entity('transaction')
export class TransactionEntity {
  @Column({ primary: true, type: 'int', generated: true, name: 'id' })
  id: number;

  @Column()
  gateway: string;

  @Column({ type: 'timestamp', name: 'transaction_date' })
  transactionDate: Date;

  @Column()
  accountNumber: string;

  @Column({ nullable: true })
  subAccount?: string;

  @Column()
  code: string;

  @Column()
  content: string;

  @Column()
  transferType: string;

  @Column()
  description: string;

  @Column()
  transferAmount: number;

  @Column()
  referenceCode: string;

  @Column()
  accumulated: number;
}
