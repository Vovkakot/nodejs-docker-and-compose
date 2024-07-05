import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { FindUser } from './dto/find-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const hash = await bcrypt.hash(password, 10);
    try {
      const newUser = await this.userRepository.save({
        ...createUserDto,
        password: hash,
      });
      delete newUser.password;
      return newUser;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const err = error.driverError;
        if (err.code === '23505') {
          throw new ConflictException(
            'Пользователь с таким email или username существует',
          );
        }
      }
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
        password: true,
      },
      where: {
        id: id,
      },
    });
    for (const item in updateUserDto) {
      if (item === 'password') {
        user[item] = await bcrypt.hash(updateUserDto[item], 10);
      } else {
        user[item] = updateUserDto[item];
      }
      try {
        const updUser = await this.userRepository.save(user);
        delete updUser.password;
        return updUser;
      } catch (error) {
        if (error instanceof QueryFailedError) {
          const err = error.driverError;
          if (err.code === '23505') {
            throw new ConflictException(
              'Пользователь с таким email или username существует',
            );
          }
        }
      }
    }
  }

  async findMany(searchTerm: FindUser): Promise<User[]> {
    const { query } = searchTerm;
    const users = await this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });
    return users.map((user) => plainToClass(User, user));
  }

  async findMe(id: number) {
    return this.userRepository.findOneBy({ id: id });
  }

  async getCurrentUserWishes(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        wishes: true,
      },
    });
    return user.wishes;
  }
  async getWishesByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
      relations: {
        wishes: true,
        offers: true,
      },
    });
    if (!user)
      throw new BadRequestException('Пользователь с таким ником не найден');
    return user.wishes;
  }
  async getUserByUsername(username: string) {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        password: true,
        username: true,
        about: true,
      },
      where: {
        username,
      },
    });
    return user;
  }
}
