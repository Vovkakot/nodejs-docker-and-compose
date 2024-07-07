import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDate, IsEmail, IsString, IsUrl, Length } from 'class-validator';
import { AVATAR_DEFAULT, ABOUT_DEFAULT } from '../../utils/constants/users';
import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column({
    type: 'varchar',
    unique: true,
    length: 30,
  })
  @IsString()
  @Length(2, 30)
  username: string;

  @Column({
    type: 'varchar',
    length: 200,
    default: ABOUT_DEFAULT,
  })
  @IsString()
  @Length(2, 200)
  about: string;

  @Column({ default: AVATAR_DEFAULT })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
