import { Module } from '@nestjs/common';
import { AuthModule } from './auth';

@Module({
  imports: [AuthModule],
  providers: [],
})
export class AppModule {}
