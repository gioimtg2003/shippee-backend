import { PRICE_TYPE_ENUM } from '@constants';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { PriceInfoEntity } from '../enities/price-info.entity';

@Injectable()
export class PriceInfoSeeder implements Seeder {
  private logger = new Logger(PriceInfoSeeder.name);
  constructor(
    @InjectRepository(PriceInfoEntity)
    private readonly priceInfo: Repository<PriceInfoEntity>,
  ) {}
  async seed(): Promise<any> {
    const data = [
      {
        priceType: PRICE_TYPE_ENUM.FIXED,
        name: 'Cước phí xe máy',
        priceValue: 11800,
      },
      {
        priceType: PRICE_TYPE_ENUM.FIXED,
        name: 'Cước phí xe Van 500Kg',
        priceValue: 111800,
      },
      {
        priceType: PRICE_TYPE_ENUM.FIXED,
        name: 'Cước phí xe Van 1 Tấn',
        priceValue: 148900,
      },
      {
        priceType: PRICE_TYPE_ENUM.FIXED,
        name: 'Cước phí xe tải 1 Tấn',
        priceValue: 148900,
      },
      {
        priceType: PRICE_TYPE_ENUM.FIXED,
        name: 'Cước phí xe tải 1.5 Tấn',
        priceValue: 224200,
      },
      {
        priceType: PRICE_TYPE_ENUM.FIXED,
        name: 'Cước phí xe tải 2 Tấn',
        priceValue: 261000,
      },
    ];

    await Promise.all(
      data.map(async (item) => {
        const priceInfo = this.priceInfo.create(item);
        this.logger.log(`Seeding ${item.name}...`);
        await this.priceInfo.save(priceInfo);
      }),
    );

    this.logger.log('Price info data seeded');
  }
  drop(): Promise<any> {
    this.logger.log('Dropping transport type data...');
    return this.priceInfo.delete({});
  }
}
