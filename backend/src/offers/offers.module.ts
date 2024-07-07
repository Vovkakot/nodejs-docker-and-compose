import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishesModule } from '../wishes/wishes.module';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Module({
  controllers: [OffersController],
  providers: [OffersService],
  imports: [
    TypeOrmModule.forFeature([Offer, Wish, User]),
    WishesModule,
    UsersModule,
  ],
  exports: [OffersService],
})
export class OffersModule {}
