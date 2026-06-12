import dotenv from 'dotenv';

dotenv.config();

interface LambdaTestCapabilities {
  browserName: string;
  browserVersion: string;
  'LT:Options': {
    platform: string;
    build: string;
    name: string;
    user?: string;
    accessKey?: string;
    network: boolean;
    video: boolean;
    console: boolean;
  };
}

export const capabilities: LambdaTestCapabilities = {
  browserName: 'Chrome',
  browserVersion: 'latest',
  'LT:Options': {
    platform: 'Windows 10',
    build: 'Playwright Sample Build',
    name: 'Playwright Sample Test',
    user: process.env.LT_USERNAME,
    accessKey: process.env.LT_ACCESS_KEY,
    network: true,
    video: true,
    console: true,
  },
};