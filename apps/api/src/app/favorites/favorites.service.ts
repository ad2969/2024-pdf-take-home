import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Favorite } from './favorites.schema';

class CreateFavoriteDto {
    readonly ticker: string;
  }

@Injectable()
export class FavoritesService {
  constructor(@InjectModel(Favorite.name) private favoriteModel: Model<Favorite>) {}

  async findAll(): Promise<Favorite[]> {
    return this.favoriteModel.find().exec();
  }

  async findOne(ticker: string): Promise<Favorite> {
    return this.favoriteModel.findOne({ ticker }).exec();
  }

  async create(createFavoriteDto: CreateFavoriteDto): Promise<Favorite> {
    const createdFavorite = new this.favoriteModel(createFavoriteDto);
    return createdFavorite.save();
  }
  
  async delete(ticker: string): Promise<void> {
    await this.favoriteModel.deleteOne({ ticker });
    return;
  }
}
