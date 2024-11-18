import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CoreEntity {
  @ApiProperty({
    example: 1,
    description: 'ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '2021-09-01T14:00:00.000Z',
    description: 'timestamp',
  })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({
    example: '2021-09-01T14:00:00.000Z',
    description: 'timestamp',
  })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ApiProperty({
    example: '2021-09-01T14:00:00.000Z',
    description: 'timestamp',
  })
  @DeleteDateColumn()
  deletedAt?: Date;
}
