import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { SignUpDto } from './dto/signUp.dto';
import { User } from '@prisma/client';
import { PasswordService } from '../common/password.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  async signUp(signUpDto: SignUpDto) {
    const existedUser = await this.getUserByEmail(signUpDto.email);
    if (existedUser) {
      throw new ConflictException('Такой email уже используется!');
    }

    if (signUpDto.password.localeCompare(signUpDto.repeatedPassword)) {
      throw new BadRequestException(`Пароли не совпадают!`);
    }

    const passwordHash = await this.passwordService.hashPassword(
      signUpDto.password,
    );

    return this.prismaService.user.create({
      data: {
        email: signUpDto.email,
        name: signUpDto.name,
        password: passwordHash,
      },
    });
  }
}
