import { buildConfig, Environment } from '@config';
import { AuthAdminModule } from '@features/auth-admin';
import { CommonModule } from '@features/common';
import { CryptoModule } from '@features/crypto';
import { DriverModule } from '@features/driver';
import { DriverWalletModule } from '@features/driver-wallet';
import { OrderModule } from '@features/order';
import { OrderStatusModule } from '@features/order-status';
import { UserModule } from '@features/user';
import { UserAuthModule } from '@features/user-auth';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

const config = buildConfig();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [`${__dirname}/**/*.entity.ts`],
      autoLoadEntities: true,
      synchronize: false,
      logging: process.env.NODE_ENV !== Environment.production,

      ssl: {
        rejectUnauthorized: true,
        ca: process.env.DATABASE_CA_CERT,
      },
    }),
    EventEmitterModule.forRoot(),
    CommonModule,
    OrderStatusModule,
    CryptoModule,
    AuthAdminModule,
    OrderModule,
    DriverWalletModule,
    DriverModule,
    UserModule,
    UserAuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
