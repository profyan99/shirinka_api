import { Config } from './config';

export const defaultConfig: () => Config = () => ({
  nest: {
    port: 3000,
  },
  cors: {
    enabled: true,
  },
  security: {
    expiresIn: '2m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
});
