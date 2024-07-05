import { Controller, Get, Post, Body, Patch, Param, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUser } from './dto/find-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/find')
  findUser(@Body() query: FindUser) {
    return this.usersService.findMany(query);
  }
  @Get('/me')
  me(@Req() req) {
    return this.usersService.findMe(req.user.id);
  }

  @Patch('/me')
  update(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Get('/me/wishes')
  getUserWishes(@Req() req) {
    return this.usersService.getCurrentUserWishes(req.user.id);
  }
  @Get('/:username')
  getUserByUsername(@Param('username') username: string) {
    return this.usersService.getUserByUsername(username);
  }

  @Get('/:username/wishes')
  getWishesByUsername(@Param('username') username: string) {
    return this.usersService.getWishesByUsername(username);
  }
}
