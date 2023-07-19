import { Controller, Get, Post, Body, Req } from '@nestjs/common';

import { AuthService } from './auth.service';
import { TokenDto } from './dto/token.dto';
import { SignInDtoDto } from './dto/signInDto.dto';
import { Public } from '../common/decorators';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('sign-in')
  public async signIn(@Body() dto: SignInDtoDto): Promise<TokenDto> {
    return await this.authService.signIn(dto);
  }

  @Post('refresh-token')
  public updateTokens(@Body('refreshToken') token: string): TokenDto {
    return this.authService.refreshToken(token);
  }

  @Get('me')
  public getMe(@Req() request): TokenDto {
    return request.user;
  }
}
