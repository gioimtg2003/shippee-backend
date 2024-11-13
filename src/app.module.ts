import { buildConfig, Environment } from '@config';
import { Module } from '@nestjs/common';
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
