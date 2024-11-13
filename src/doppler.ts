import { execSync } from 'child_process';
import 'dotenv/config';

const DOPPLER_VERSION = 'v3';

console.log('Start loading Doppler secrets');

export function loadEnv() {
  if (!process.env.DOPPLER_TOKEN) return;

  const fetchDopplerCLI = [
    'curl',
    '--connect-timeout 20',
    '--silent',
    '--request GET',
    '--url',
    `https://${process.env.DOPPLER_TOKEN}@api.doppler.com/${DOPPLER_VERSION}/configs/config/secrets/download?format=json`,
  ].join(' ');

  const dopplerSecrets = execSync(fetchDopplerCLI);

  process.env = {
    ...JSON.parse(dopplerSecrets.toString()),
    ...process.env,
  };
}
