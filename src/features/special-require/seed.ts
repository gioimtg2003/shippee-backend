import { PRICE_TYPE_ENUM, SPECIAL_REQUIRE_ENUM } from '@constants';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpecialRequireItemEntity } from './special-require-item.entity';

export class SpecialRequireSeed {
  private readonly logger = new Logger(SpecialRequireSeed.name);

  constructor(
    @InjectRepository(SpecialRequireItemEntity)
    private readonly repo: Repository<SpecialRequireItemEntity>,
  ) {}

  async seed(): Promise<any> {
    const data = [
      {
        code: SPECIAL_REQUIRE_ENUM.STATION,
        name: 'GH Bến Bãi (Đã bao gồm phí vào cổng)',
        priceValue: 20000,
        priceType: PRICE_TYPE_ENUM.FIXED,
        id: 1,
      },
      {
        id: 2,
        name: 'Giao Hàng Cồng Kềnh',
        priceValue: 0,
        priceType: PRICE_TYPE_ENUM.FIXED,
      },
      {
        id: 3,
        code: SPECIAL_REQUIRE_ENUM.EXTRA_CAPACITY_W_EQUIPMENT,
        name: 'Giao Hàng Cồng Kềnh (Có Baga), 60x50x60cm, đến 50kg',
        priceValue: 20000,
        priceType: PRICE_TYPE_ENUM.FIXED,
        parent: {
          id: 2,
        },
      },
      {
        code: SPECIAL_REQUIRE_ENUM.EXTRA_CAPACITY_W,
        id: 4,
        name: 'Giao Hàng Cồng Kềnh (Không Baga), 55x45x55cm, đến 40kg',
        priceValue: 10000,
        priceType: PRICE_TYPE_ENUM.FIXED,
        parent: {
          id: 2,
        },
      },
      {
        code: SPECIAL_REQUIRE_ENUM.ROUND_TRIP,
        id: 5,
        name: 'Giao Hàng Hai Chiều',
        priceValue: 70,
        priceType: PRICE_TYPE_ENUM.PERCENT,
      },
      {
        code: SPECIAL_REQUIRE_ENUM.DOOR_TO_DOOR_DRIVER,
        id: 6,
        name: 'Giao Hàng Tận Nơi',
        priceValue: 10000,
        priceType: PRICE_TYPE_ENUM.FIXED,
      },
      {
        id: 7,
        name: 'Dịch Vụ Bốc Xếp',
        priceValue: 0,
        priceType: PRICE_TYPE_ENUM.FIXED,
      },
      {
        id: 8,
        code: SPECIAL_REQUIRE_ENUM.DOOR_TO_DOOR_DRIVER,
        name: 'Bốc Xếp Tận Nơi (Bởi tài xế)',
        priceValue: 140000,
        priceType: PRICE_TYPE_ENUM.FIXED,
        parent: {
          id: 7,
        },
      },
      {
        code: SPECIAL_REQUIRE_ENUM.DOOR_TO_DOOR_DRIVER_HELPER,
        id: 9,
        name: 'Bốc Xếp Đuôi Xe (Có người hỗ trợ)',
        priceValue: 350000,
        priceType: PRICE_TYPE_ENUM.FIXED,
        parent: {
          id: 7,
        },
      },
    ];

    await Promise.all(
      data.map(async (item) => {
        const priceInfo = this.repo.create(item);
        this.logger.log(`Seeding transport id ${item.id}...`);
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
