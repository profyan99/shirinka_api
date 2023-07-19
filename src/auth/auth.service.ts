import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { User } from '@prisma/client';
import { SignInDtoDto } from './dto/signInDto.dto';
import { PasswordService } from '../common/password.service';
import { TokenDto } from './dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from '../common/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDtoDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: signInDto.email,
      },
    });
    if (!user) {
      throw new NotFoundException(`Такого пользователя не существует!`);
    }

    const isPasswordValid = await this.passwordService.validatePassword(
      signInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Неверный пароль!');
    }

    return this.generateTokens(user.id);
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens(userId);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  validateUser(userId: string): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  private generateTokens(userId: string): TokenDto {
    return {
      accessToken: this.generateAccessToken(userId),
      refreshToken: this.generateRefreshToken(userId),
    };
  }

  private generateAccessToken(userId: string): string {
    return this.jwtService.sign({
      userId,
    });
  }

  private generateRefreshToken(userId: string): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(
      {
        userId,
      },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: securityConfig.refreshIn,
      },
    );
  }
}
