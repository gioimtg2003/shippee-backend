import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { loadEnv } from '../src/doppler';

loadEnv();
console.log('Start migration process');

const config = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DATABASE_CA_CERT,
  },
  entities: ['src/**/*.entity.ts'],
  migrations: ['migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
