import { TRANSPORT_TYPE_ENUM } from '@constants';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { TransportTypeEntity } from '../transport-type.entity';

@Injectable()
export class TransportTypeSeeder implements Seeder {
  private logger = new Logger(TransportTypeSeeder.name);
  constructor(
    @InjectRepository(TransportTypeEntity)
    private readonly transportType: Repository<TransportTypeEntity>,
  ) {}
  async seed(): Promise<any> {
    const data = [
      {
        name: 'Xe máy',
        imageUrl: 'https://media-shipppee.nguyenconggioi.me/moto_bike.png',
        description: 'Hàng giá trị chỉ đến 2 triệu đồng và Không thu tiền hộ',
        code: TRANSPORT_TYPE_ENUM.BIKE,
        loadWeight: 30000,
        textWeight: '30Kg',
        textSize: '0.5 x 0.4 x 0.5 m',
        exceedSegmentPrices: [],
        priceInfoId: 1,
      },
      {
        name: 'Xe Van 500Kg',
        imageUrl: 'https://media-shipppee.nguyenconggioi.me/van.png',
        description: 'Hoạt động tất cả khung giờ, chở tối đa 500kg',
        code: TRANSPORT_TYPE_ENUM.VAN_500,
        loadWeight: 500000,
        textWeight: '500Kg',
        textSize: '1.7 x 1.2 x 1.2 Mét',
        exceedSegmentPrices: [],
        priceInfoId: 2,
      },
      {
        name: 'Xe Van 1 Tấn',
        imageUrl: 'https://media-shipppee.nguyenconggioi.me/van.png',
        description: 'Hoạt động tất cả khung giờ, chở tối đa 1 Tấn',
        code: TRANSPORT_TYPE_ENUM.VAN_1T,
        loadWeight: 1000000,
        textWeight: '1 Tấn',
        textSize: '2.1 x 1.3 x 1.3 Mét',
        exceedSegmentPrices: [],
        priceInfoId: 6,
      },
      {
        name: 'Xe Tải 1 Tấn',
        imageUrl: 'https://media-shipppee.nguyenconggioi.me/truck.png',
        description: 'Cấm tải 6H-9H và 16H-19H, chở tối đa 1 Tấn',
        code: TRANSPORT_TYPE_ENUM.TRUCK_1T,
        loadWeight: 1000000,
        textWeight: '1 Tấn',
        textSize: '3 x 1.6 x 1.6 Mét',
        exceedSegmentPrices: [],
        priceInfoid: 4,
      },
      {
        name: 'Xe Tải 1.5 Tấn',
        imageUrl: 'https://media-shipppee.nguyenconggioi.me/truck.png',
        description: 'Cấm tải 6H-9H và 16H-19H, chở tối đa 1.5 Tấn',
        code: TRANSPORT_TYPE_ENUM.TRUCK_1T5,
        loadWeight: 1500000,
        textWeight: '1.5 Tấn',
        textSize: '3.2 x 1.6 x 1.7 Mét',
        exceedSegmentPrices: [],
        priceInfoid: 5,
      },
      {
        name: 'Xe Tải 2 Tấn',
        imageUrl: 'https://media-shipppee.nguyenconggioi.me/truck.png',
        description: 'Cấm tải 6H-9H và 16H-19H, chở tối đa 2 Tấn',
        code: TRANSPORT_TYPE_ENUM.TRUCK_2T,
        loadWeight: 2000000,
        textWeight: '2 Tấn',
        textSize: '4 x 1.7 x 1.8 Mét',
        exceedSegmentPrices: [],
        priceInfoid: 3,
      },
    ];

    await Promise.all(
      data.map(async (item) => {
        const transportType = this.transportType.create(item);
        this.logger.log(`Seeding ${item.name}...`);
        await this.transportType.save(transportType);
      }),
    );

    this.logger.log('Transport type data seeded');
  }
  drop(): Promise<any> {
    this.logger.log('Dropping transport type data...');
    return this.transportType.delete({});
  }
}
