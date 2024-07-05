import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('/signin')
  login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Post('/signup')
  registration(@Body() userDto: CreateUserDto) {
    return this.userService.create(userDto);
  }
}
