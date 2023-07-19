import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signUp.dto';
import { User } from '@prisma/client';
import { Public } from '../common/decorators';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post('sign-up')
  signUp(@Body() dto: SignUpDto): Promise<User> {
    return this.userService.signUp(dto);
  }
}
