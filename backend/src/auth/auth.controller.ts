import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalGuard } from './guards/local.guard';
import { User } from '../users/entities/user.entity';

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    return await this.authService.auth(user);
  }

  @Post('signin')
  @UseGuards(LocalGuard)
  async signin(@Req() req: Request & { user: User }) {
    return this.authService.auth(req.user);
  }
}
