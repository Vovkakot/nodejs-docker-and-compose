import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createWishDto: CreateWishDto, @Req() req) {
    return this.wishesService.create(createWishDto, req.user.id);
  }

  @Get('id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: number) {
    return this.wishesService.findById(id);
  }

  @Patch('id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: number,
    @Body() creteWishDto: CreateWishDto,
    @Req() req,
  ) {
    return this.wishesService.update(id, creteWishDto, req.user.id);
  }

  @Delete('id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: number, @Req() req) {
    return this.wishesService.delete(id, req.user.id);
  }

  @Get('last')
  getLastWishes() {
    return this.wishesService.getLastWishes();
  }

  @Get('top')
  getTopWishes() {
    return this.wishesService.getTopWishes();
  }

  @Post(':id/copy')
  @UseGuards(AuthGuard('jwt'))
  copy(@Param('id') id: number, @Req() req) {
    return this.wishesService.copy(id, req.user.id);
  }
}
