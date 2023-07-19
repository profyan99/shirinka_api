import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { UserModule } from './user';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import { defaultConfig } from './common/config/default.config';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true, load: [defaultConfig] }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
