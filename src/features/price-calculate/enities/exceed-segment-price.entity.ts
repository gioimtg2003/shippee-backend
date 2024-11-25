import { CoreEntity } from '@common/entities';
import { TransportTypeEntity } from '@features/transport-type/transport-type.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';

@Entity('exceed_segment_price')
export class ExceedSegmentPriceEntity extends CoreEntity {
  @ApiProperty({
    example: 999999,
    description: 'End extra distance',
  })
  @Column()
  endExtraDistanceKm: number;

  @ApiProperty({
    example: 4000,
    description: 'Price extra',
  })
  @Column()
  priceExtra: number;

  @ApiProperty({
    example: 2,
    description: 'End extra distance',
  })
  @Column()
  startExtraDistanceKm: number;

  @ManyToOne(() => TransportTypeEntity)
  transportType: Relation<TransportTypeEntity>;
}
