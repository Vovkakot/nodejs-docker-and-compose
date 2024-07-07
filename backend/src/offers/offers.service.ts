import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository, DataSource } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entities/user.entity';
import { getRaisedAmount } from './helpers/getRaised';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
    private readonly dataSource: DataSource,
  ) {}

  async createOffer(createOfferDto: CreateOfferDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wish = await this.wishesService.findWishById(createOfferDto.itemId);

      const raisedAmount = getRaisedAmount(
        Number(wish.raised),
        createOfferDto.amount,
      );

      if (user.id === wish.owner.id) {
        throw new ServerException(ErrorCode.OfferForbidden);
      }

      if (raisedAmount > wish.price) {
        throw new ServerException(ErrorCode.OfferRaisedForbidden);
      }

      await this.wishesService.updateWishRaised(
        createOfferDto.itemId,
        raisedAmount,
      );

      const offer = await this.offersRepository.save({
        ...createOfferDto,
        wish,
        user,
      });
      await queryRunner.commitTransaction();
      delete wish.owner.password;
      delete user.password;
      return offer;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllOffers(): Promise<Offer[]> {
    return await this.offersRepository.find({
      relations: ['item', 'user'],
    });
  }

  async findOneOffer(id: number): Promise<Offer> {
    const offer = await this.offersRepository.findOne({
      where: { id },
      relations: ['item', 'user'],
    });

    if (!offer) {
      throw new ServerException(ErrorCode.OfferNotFound);
    }

    delete offer.user.password;

    return offer;
  }
}
