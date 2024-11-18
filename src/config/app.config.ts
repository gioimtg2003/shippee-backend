import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { loadEnv } from 'src/doppler';

loadEnv();

export enum Environment {
  development = 'development',
  production = 'production',
  localhost = 'localhost',
}

/**
 * Interface for app configuration properties
 */
interface IConfig {
  origin: CorsOptions['origin'];
  environment: Environment;
  enableApolloLandingPage: boolean;
  enableSwagger: boolean;
}

type IConfigs = {
  [key in Environment]: IConfig;
};

export const Origins = {
  domain: 'app-shippee.nguyenconggioi.me',
};

/**
 * Configuration settings for different environments
 */
const configs: IConfigs = {
  [Environment.development]: {
    origin: /.*/,
    environment: Environment.development,
    enableApolloLandingPage: false,
    enableSwagger: false,
  },

  [Environment.production]: {
    origin: [Origins.domain],
    environment: Environment.production,
    enableApolloLandingPage: false,
    enableSwagger: false,
  },

  [Environment.localhost]: {
    origin: /.*/,
    environment: Environment.localhost,
    enableApolloLandingPage: true,
    enableSwagger: true,
  },
};

/**
 * Build app configuration based on the environment variable or default to localhost if not set or invalid value is provided for the environment variable
 * @returns app configuration based on the environment
 */
export const buildConfig = (): IConfig => {
  const env = process.env.ENVIRONMENT as Environment;
  const environment = env || Environment.localhost;
  return configs[environment];
};
