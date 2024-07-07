import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async createWish(
    createWishDto: CreateWishDto,
    user: User,
  ): Promise<Record<string, never>> {
    await this.wishesRepository.save({
      ...createWishDto,
      owner: user,
    });

    return {};
  }

  async findAllWishes() {
    const wishes = await this.wishesRepository.find({
      relations: ['owner', 'offers'],
    });

    return wishes;
  }

  async findWishById(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
    });

    if (!wish) {
      throw new ServerException(ErrorCode.WishNotFound);
    }

    return wish;
  }

  async findManyByIdWishes(idWishes: number[]): Promise<Wish[]> {
    return this.wishesRepository.find({
      where: { id: In(idWishes) },
    });
  }

  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      take: 40,
      order: { createdAt: 'desc' },
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
    });
  }

  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      take: 20,
      order: { copied: 'desc' },
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
    });
  }

  async updateWish(
    wishId: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ): Promise<Record<string, never>> {
    const wish = await this.findWishById(wishId);

    if (!wish) {
      throw new ServerException(ErrorCode.WishNotFound);
    }

    if (wish.raised > 0) {
      throw new ServerException(ErrorCode.OfferRaisedForbidden);
    }

    if (wish.owner.id !== userId) {
      throw new ServerException(ErrorCode.WishForbidden);
    }

    await this.wishesRepository.update(wishId, updateWishDto);

    return {};
  }

  async updateWishRaised(
    wishId: number,
    raised: number,
  ): Promise<Record<string, never>> {
    await this.wishesRepository.update(wishId, { raised });
    return {};
  }

  async removeWishById(wishId: number, userId: number): Promise<Wish> {
    const wish = await this.findWishById(wishId);
    if (!wish) {
      throw new ServerException(ErrorCode.WishNotFound);
    }

    if (wish.owner.id !== userId) {
      throw new ServerException(ErrorCode.WishForbidden);
    }

    await this.wishesRepository.delete(wishId);

    return wish;
  }

  async copyWish(wishId: number, user: User): Promise<Record<string, never>> {
    const wish = await this.wishesRepository.findOneBy({ id: wishId });

    if (!wish) {
      throw new ServerException(ErrorCode.WishNotFound);
    }

    delete wish.id;
    delete wish.createdAt;
    delete wish.updatedAt;

    await this.wishesRepository.update(wishId, {
      copied: (wish.copied += 1),
    });

    const wishCopy = {
      ...wish,
      owner: user,
      copied: 0,
      raised: 0,
      offers: [],
    };

    await this.createWish(wishCopy, user);

    return {};
  }
}
