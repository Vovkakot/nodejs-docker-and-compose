import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { Wishlist } from './entities/wishlist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { WishesModule } from '../wishes/wishes.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [WishlistsController],
  providers: [WishlistsService],
  imports: [
    TypeOrmModule.forFeature([Wishlist, Wish, User]),
    UsersModule,
    WishesModule,
  ],
})
export class WishlistsModule {}
