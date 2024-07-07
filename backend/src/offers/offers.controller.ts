import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  UseFilters,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { Offer } from './entities/offer.entity';
import { ServerExceptionFilter } from '../filter/server-exception.filter';

@UseGuards(JwtGuard)
@UseFilters(ServerExceptionFilter)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async createOffer(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    const user = req.user;
    return this.offersService.createOffer(createOfferDto, user);
  }

  @Get()
  async findAllOffers(): Promise<Offer[]> {
    return this.offersService.findAllOffers();
  }

  @Get(':id')
  findOneOffer(@Param('id') id: string): Promise<Offer> {
    return this.offersService.findOneOffer(Number(id));
  }
}
