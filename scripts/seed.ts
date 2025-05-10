/* eslint-disable @typescript-eslint/no-unused-vars */
import { Environment } from '@config';
import { AdminEntity } from '@features/admin/entities';
import { CustomerEntity } from '@features/customer/customer.entity';
import { WalletHistoryEntity } from '@features/driver-wallet/entities';
import { DriverEntity, DriverIdentityEntity } from '@features/driver/entities';
import { OrderStatusEntity } from '@features/order-status/order-status.entity';
import { OrderAssignmentEntity } from '@features/order/entities/order-assignment.entity';
import { OrderEntity } from '@features/order/entities/order.entity';
import { ExceedSegmentPriceEntity } from '@features/price-calculate/enities/exceed-segment-price.entity';
import { PriceInfoEntity } from '@features/price-calculate/enities/price-info.entity';
import { SpecialRequireSeed } from '@features/special-require/seed';
import { SpecialRequireItemEntity } from '@features/special-require/special-require-item.entity';
import { TransportTypeEntity } from '@features/transport-type/transport-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';
import { loadEnv } from 'src/doppler';
loadEnv();

seeder({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      autoLoadEntities: true,
      synchronize: false,
      logging: process.env.NODE_ENV !== Environment.production,
      ssl: {
        rejectUnauthorized: true,
        ca: process.env.DATABASE_CA_CERT,
      },
    }),
    TypeOrmModule.forFeature([
      PriceInfoEntity,
      TransportTypeEntity,
      ExceedSegmentPriceEntity,
      DriverEntity,
      WalletHistoryEntity,
      DriverIdentityEntity,
      OrderEntity,
      CustomerEntity,
      AdminEntity,
      SpecialRequireItemEntity,
      OrderStatusEntity,
      OrderAssignmentEntity,
    ]),
  ],
}).run([SpecialRequireSeed]);
