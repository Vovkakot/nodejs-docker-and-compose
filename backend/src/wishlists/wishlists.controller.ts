import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseFilters,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from '../auth/guards/auth.guard';
import { ServerExceptionFilter } from '../filter/server-exception.filter';
import { User } from '../users/entities/user.entity';
import { Wishlist } from './entities/wishlist.entity';

@UseGuards(JwtGuard)
@UseFilters(ServerExceptionFilter)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  async getWishlists(): Promise<Wishlist[]> {
    return await this.wishlistsService.findAllWishlists();
  }

  @Post()
  async createWishlist(
    @Req() { user }: { user: User },
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.createWishlist(createWishlistDto, user);
  }

  @Get(':id')
  async getWishlistById(@Param('id') wishId: number): Promise<Wishlist> {
    const wishlist = await this.wishlistsService.findWishlistById(
      Number(wishId),
    );

    return wishlist;
  }

  @Patch(':id')
  async updateWishlist(
    @Req() { user }: { user: User },
    @Param('id') wishId: string,
    @Body() dto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.updateWishlist(
      Number(wishId),
      dto,
      user.id,
    );
  }

  @Delete(':id')
  async deleteWishlist(
    @Req() { user }: { user: User },
    @Param('id') id: number,
  ): Promise<Wishlist> {
    return await this.wishlistsService.deleteWishlistById(id, user.id);
  }
}
