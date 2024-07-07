import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { HashService } from '../hash/hash.service';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    private readonly hashService: HashService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const isUserAlreadyExists = await this.usersRepository.findBy([
      { username: createUserDto.username },
      { email: createUserDto.email },
    ]);

    if (isUserAlreadyExists.length > 0) {
      throw new ServerException(ErrorCode.UserAlreadyExists);
    }

    return this.usersRepository.save({
      ...createUserDto,
      password: await this.hashService.hashPassword(createUserDto.password),
    });
  }

  async findUserByUsername(username: string): Promise<User> {
    return await this.usersRepository.findOneBy({ username });
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email });
  }

  async findUserById(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async updateUserById(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findUserById(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailMatches = await this.findUserByEmail(updateUserDto.email);

      if (emailMatches) {
        throw new ServerException(ErrorCode.UserAlreadyExists);
      }
    }

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const usernameMatches = await this.findUserByUsername(
        updateUserDto.username,
      );
      if (usernameMatches) {
        throw new ServerException(ErrorCode.UserAlreadyExists);
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashService.hashPassword(
        updateUserDto.password,
      );
    }

    const newUserData: User = {
      ...user,
      password: updateUserDto?.password,
      email: updateUserDto?.email,
      about: updateUserDto?.about,
      username: updateUserDto?.username,
      avatar: updateUserDto?.avatar,
    };

    await this.usersRepository.update(user.id, newUserData);

    return await this.findUserById(id);
  }

  async findUserWishes(id: number): Promise<Wish[]> {
    return this.wishesRepository.find({
      where: { owner: { id } },
      relationLoadStrategy: 'join',
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

  async findMany(query: string): Promise<User[]> {
    return await this.usersRepository.find({
      where: [{ username: Like(`${query}%`) }, { email: Like(`${query}%`) }],
    });
  }
}
