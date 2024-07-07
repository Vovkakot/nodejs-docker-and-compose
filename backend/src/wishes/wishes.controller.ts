import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseFilters,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../auth/guards/auth.guard';
import { User } from '../users/entities/user.entity';
import { Wish } from './entities/wish.entity';
import { ServerExceptionFilter } from '../filter/server-exception.filter';

@UseFilters(ServerExceptionFilter)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createWish(
    @Req() { user }: { user: User },
    @Body() dto: CreateWishDto,
  ): Promise<Record<string, never>> {
    return await this.wishesService.createWish(dto, user);
  }

  @Get()
  @UseGuards(JwtGuard)
  async findAllWishes(): Promise<Wish[]> {
    return await this.wishesService.findAllWishes();
  }

  @Get('last')
  async findLastWishes(): Promise<Wish[]> {
    return await this.wishesService.getLastWishes();
  }

  @Get('top')
  async findTopWishes(): Promise<Wish[]> {
    return await this.wishesService.getTopWishes();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async findWishById(@Param('id') id: string): Promise<Wish> {
    return await this.wishesService.findWishById(Number(id));
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async updateWish(
    @Req() { user }: { user: User },
    @Param('id') id: string,
    @Body() dto: UpdateWishDto,
  ): Promise<Record<string, never>> {
    return await this.wishesService.updateWish(Number(id), dto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteWish(
    @Req() { user }: { user: User },
    @Param('id') id: string,
  ): Promise<Wish> {
    return await this.wishesService.removeWishById(Number(id), user.id);
  }

  @Post(':id/copy')
  @UseGuards(JwtGuard)
  async copyWish(
    @Req() { user }: { user: User },
    @Param('id') id: string,
  ): Promise<Record<string, never>> {
    return await this.wishesService.copyWish(Number(id), user);
  }
}
