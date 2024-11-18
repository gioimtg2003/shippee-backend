import { Environment } from '@config';
import { REQUEST_LIMIT_RATE } from '@constants';
import { AdminModule } from '@features/admin';
import { AuthAdminModule } from '@features/auth-admin';
import { CryptoModule } from '@features/crypto';
import { DriverModule } from '@features/driver';
import { DriverManageModule } from '@features/driver-manage';
import { DriverWalletModule } from '@features/driver-wallet';
import { OrderModule } from '@features/order';
import { OrderStatusModule } from '@features/order-status';
import { TransportTypeModule } from '@features/transport-type';
import { UserModule } from '@features/user';
import { UserAuthModule } from '@features/user-auth';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';

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
    ThrottlerModule.forRoot([REQUEST_LIMIT_RATE['global']]),
    EventEmitterModule.forRoot(),
    AdminModule,
    DriverManageModule,
    TransportTypeModule,
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
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
  ],
})
export class AppModule {}
