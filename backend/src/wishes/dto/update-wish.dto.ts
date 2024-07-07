import { PartialType } from '@nestjs/swagger';
import { CreateWishDto } from './create-wish.dto';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @IsString()
  @Length(1, 250)
  @IsOptional()
  name: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  link: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  image: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price: number;

  @IsString()
  @Length(1, 1024)
  @IsOptional()
  description: string;
}
