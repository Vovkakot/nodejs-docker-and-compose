import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { validate } from 'class-validator';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishListRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, id: number) {
    const { itemsId } = createWishlistDto;
    const items = itemsId.map((item): Wish | { id: number } => ({
      id: item,
    }));
    const wishList = await this.validate(createWishlistDto);
    const user = await this.userRepository.findOneBy({ id: id });
    const wishes = await this.wishRepository.find({
      where: items,
    });
    wishList.owner = user;
    wishList.items = wishes;
    return this.wishListRepository.save(wishList);
  }

  findAll() {
    return this.wishListRepository.find();
  }

  findOne(id: number) {
    return this.wishListRepository.findOne({
      relations: {
        items: true,
        owner: true,
      },
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishList = await this.wishListRepository.findOne({
      relations: {
        owner: true,
      },
      where: {
        id,
        owner: {
          id: userId,
        },
      },
    });
    for (const key in updateWishlistDto) {
      if (key === 'itemsId') {
        const items = updateWishlistDto[key].map(
          (item): Wish | { id: number } => ({
            id: item,
          }),
        );
        wishList.items = await this.wishRepository.find({
          where: items,
        });
      } else {
        wishList[key] = updateWishlistDto[key];
      }
    }

    return this.wishListRepository.save(wishList);
  }

  async remove(id: number, userId: number) {
    const wishList = await this.wishListRepository.findOne({
      relations: {
        owner: true,
      },
      where: {
        id,
        owner: {
          id: userId,
        },
      },
    });
    return await this.wishListRepository.remove(wishList);
  }

  private async validate(createWishlistDto: CreateWishlistDto) {
    const wishList = new Wishlist();
    for (const key in createWishlistDto) {
      wishList[key] = createWishlistDto[key];
    }
    const errors = await validate(wishList, { whitelist: true });
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return wishList;
  }
}
