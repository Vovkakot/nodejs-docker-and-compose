import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { User } from './entities/user.entity';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';
import { ServerExceptionFilter } from '../filter/server-exception.filter';
import { Wish } from '../wishes/entities/wish.entity';

@UseGuards(JwtGuard)
@UseFilters(ServerExceptionFilter)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getCurrentUser(@Req() req): Promise<User> {
    const currentUser = await this.usersService.findUserById(req.user.id);

    if (!currentUser) {
      throw new ServerException(ErrorCode.UserNotFound);
    }

    return currentUser;
  }

  @Patch('me')
  async updateCurrentUserById(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateUserById(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  async findCurrentUserWishes(@Req() req): Promise<Wish[]> {
    return await this.usersService.findUserWishes(req.user.id);
  }

  @Get(':username')
  async getUserData(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findUserByUsername(username);

    if (!user) {
      throw new ServerException(ErrorCode.UserNotFound);
    }

    return user;
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    const user = await this.usersService.findUserByUsername(username);

    if (!user) {
      throw new ServerException(ErrorCode.UserNotFound);
    }

    return await this.usersService.findUserWishes(user.id);
  }

  @Post('find')
  async findUsersByQuery(@Body('query') query: string): Promise<User[]> {
    return await this.usersService.findMany(query);
  }
}
