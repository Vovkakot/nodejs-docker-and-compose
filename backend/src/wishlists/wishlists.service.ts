import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from '../wishes/wishes.service';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async createWishlist(
    createWishlistDto: CreateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const wishesList = await this.wishesService.findManyByIdWishes(
      createWishlistDto.itemsId,
    );

    await this.wishlistsRepository.save({
      ...createWishlistDto,
      owner: user,
      items: wishesList,
    });

    return await this.wishlistsRepository.findOne({
      where: { name: createWishlistDto.name },
      relations: ['owner', 'items'],
    });
  }

  async findAllWishlists(): Promise<Wishlist[]> {
    return await this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async findWishlistById(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new ServerException(ErrorCode.WishlistNotFound);
    }

    return wishlist;
  }

  async updateWishlist(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const wishlist = await this.findWishlistById(id);

    if (!wishlist) {
      throw new ServerException(ErrorCode.WishlistNotFound);
    }

    if (wishlist.owner.id !== userId) {
      throw new ServerException(ErrorCode.WishlistForbidden);
    }

    const wishes = await this.wishesService.findManyByIdWishes(
      updateWishlistDto.itemsId || [],
    );

    return await this.wishlistsRepository.save({
      ...wishlist,
      name: updateWishlistDto.name,
      image: updateWishlistDto.image,
      description: updateWishlistDto.description,
      items: wishes.concat(wishlist.items),
    });
  }

  async deleteWishlistById(id: number, userId: number): Promise<Wishlist> {
    const wishlist = await this.findWishlistById(id);

    if (!wishlist) {
      throw new ServerException(ErrorCode.WishlistNotFound);
    }

    if (wishlist.owner.id !== userId) {
      throw new ServerException(ErrorCode.WishlistForbidden);
    }

    await this.wishlistsRepository.delete(id);

    return wishlist;
  }
}
