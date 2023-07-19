export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
}

export interface NestConfig {
  port: number;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface Config {
  nest: NestConfig;
  cors: CorsConfig;
  security: SecurityConfig;
}
