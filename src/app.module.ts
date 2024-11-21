import { Environment } from '@config';
import { REQUEST_LIMIT_RATE } from '@constants';
import { AdminModule } from '@features/admin';
import { AuthAdminModule } from '@features/auth-admin';
import { CryptoModule } from '@features/crypto';
import { DriverModule } from '@features/driver';
import { DriverManageModule } from '@features/driver-manage';
import { DriverWalletModule } from '@features/driver-wallet';
import { ImageModule } from '@features/image/image.module';
import { MailModule } from '@features/mail';
import { OrderModule } from '@features/order';
import { OrderStatusModule } from '@features/order-status';
import { TransportTypeModule } from '@features/transport-type';
import { UserModule } from '@features/user';
import { UserAuthModule } from '@features/user-auth';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        port: Number(process.env.EMAIL_PORT) || 465,
        secure: false,
        tls: {
          rejectUnauthorized: false,
        },
      },
      template: {
        dir: join(__dirname, 'features/mail/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    MailModule,
    ThrottlerModule.forRoot([REQUEST_LIMIT_RATE['global']]),
    EventEmitterModule.forRoot(),
    AdminModule,
    DriverManageModule,
    TransportTypeModule,
    OrderStatusModule,
    CryptoModule,
    AuthAdminModule,
    ImageModule,
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
