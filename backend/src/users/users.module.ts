import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { HashService } from '../hash/hash.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService, HashService],
  imports: [TypeOrmModule.forFeature([User, Wish])],
  exports: [UsersService],
})
export class UsersModule {}
