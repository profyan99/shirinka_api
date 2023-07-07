import {
  Controller,
  Get,
  Post,
  UseGuards,
  UnauthorizedException,
  Body,
} from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private auth: AuthService) {}

  /**
   * See test/e2e/jwt-auth.spec.ts
   */
  @UseGuards(LocalAuthGuard)
  @Post('jwt/login')
  public jwtLogin(@ReqUser() user: Payload): JwtSign {
    return this.auth.jwtSign(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('jwt/check')
  public jwtCheck(@ReqUser() user: Payload): Payload {
    return user;
  }

  // Only verify is performed without checking the expiration of the access_token.
  @UseGuards(JwtVerifyGuard)
  @Post('jwt/refresh')
  public jwtRefresh(
    @ReqUser() user: Payload,
    @Body('refresh_token') token?: string,
  ): JwtSign {
    if (!token || !this.auth.validateRefreshToken(user, token)) {
      throw new UnauthorizedException('InvalidRefreshToken');
    }

    return this.auth.jwtSign(user);
  }
}
