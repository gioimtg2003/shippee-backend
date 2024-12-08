import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { ExceedSegmentPriceEntity } from '../enities/exceed-segment-price.entity';

@Injectable()
export class SegmentPrice implements Seeder {
  private readonly logger = new Logger(SegmentPrice.name);

  constructor(
    @InjectRepository(ExceedSegmentPriceEntity)
    private readonly repo: Repository<ExceedSegmentPriceEntity>,
  ) {}

  async seed(): Promise<any> {
    const data = [
      {
        endExtraDistanceKm: 9999,
        startExtraDistanceKm: 2,
        priceExtra: 4300,
        transportTypeId: 1,
      },
      {
        endExtraDistanceKm: 10,
        startExtraDistanceKm: 4,
        priceExtra: 10800,
        transportTypeId: 5,
      },
      {
        endExtraDistanceKm: 15,
        startExtraDistanceKm: 10,
        priceExtra: 7560,
        transportTypeId: 5,
      },
      {
        endExtraDistanceKm: 45,
        startExtraDistanceKm: 15,
        priceExtra: 5940,
        transportTypeId: 5,
      },
      {
        endExtraDistanceKm: 9999,
        startExtraDistanceKm: 45,
        priceExtra: 4860,
        transportTypeId: 5,
      },
      {
        endExtraDistanceKm: 10,
        startExtraDistanceKm: 4,
        priceExtra: 12420,
        transportTypeId: 4,
      },
      {
        endExtraDistanceKm: 15,
        startExtraDistanceKm: 10,
        priceExtra: 9720,
        transportTypeId: 4,
      },
      {
        endExtraDistanceKm: 45,
        startExtraDistanceKm: 15,
        priceExtra: 7020,
        transportTypeId: 4,
      },
      {
        endExtraDistanceKm: 9999,
        startExtraDistanceKm: 45,
        priceExtra: 5400,
        transportTypeId: 4,
      },
      {
        endExtraDistanceKm: 10,
        startExtraDistanceKm: 4,
        priceExtra: 12420,
        transportTypeId: 6,
      },
      {
        endExtraDistanceKm: 15,
        startExtraDistanceKm: 10,
        priceExtra: 9720,
        transportTypeId: 6,
      },
      {
        endExtraDistanceKm: 45,
        startExtraDistanceKm: 15,
        priceExtra: 7020,
        transportTypeId: 6,
      },
      {
        endExtraDistanceKm: 9999,
        startExtraDistanceKm: 45,
        priceExtra: 5400,
        transportTypeId: 6,
      },
      {
        endExtraDistanceKm: 10,
        startExtraDistanceKm: 4,
        priceExtra: 12420,
        transportTypeId: 3,
      },
      {
        endExtraDistanceKm: 15,
        startExtraDistanceKm: 10,
        priceExtra: 9720,
        transportTypeId: 3,
      },
      {
        endExtraDistanceKm: 45,
        startExtraDistanceKm: 15,
        priceExtra: 7020,
        transportTypeId: 3,
      },
      {
        endExtraDistanceKm: 9999,
        startExtraDistanceKm: 45,
        priceExtra: 5940,
        transportTypeId: 3,
      },
      {
        endExtraDistanceKm: 10,
        startExtraDistanceKm: 4,
        priceExtra: 13500,
        transportTypeId: 2,
      },
      {
        endExtraDistanceKm: 15,
        startExtraDistanceKm: 10,
        priceExtra: 10800,
        transportTypeId: 2,
      },
      {
        endExtraDistanceKm: 45,
        startExtraDistanceKm: 15,
        priceExtra: 7020,
        transportTypeId: 2,
      },
      {
        endExtraDistanceKm: 9999,
        startExtraDistanceKm: 45,
        priceExtra: 5940,
        transportTypeId: 2,
      },
    ];

    await Promise.all(
      data.map(async (item) => {
        const priceInfo = this.repo.create({
          endExtraDistanceKm: item.endExtraDistanceKm,
          startExtraDistanceKm: item.startExtraDistanceKm,
          priceExtra: item.priceExtra,
          transportType: {
            id: item.transportTypeId,
          },
        });
        this.logger.log(`Seeding transport id ${item.transportTypeId}...`);
        await this.repo.save(priceInfo);
      }),
    );

    this.logger.log('Segment price data seeded');
  }
  drop(): Promise<any> {
    this.logger.log('Dropping segment price data...');
    return this.repo.delete({});
  }
}
