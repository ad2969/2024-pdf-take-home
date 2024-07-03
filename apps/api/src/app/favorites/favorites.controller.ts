import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Favorite } from './favorites.schema';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoriteService: FavoritesService) {}

  @Get('/')
  async getAll(@Param() params: any): Promise<Favorite[]> {
    const response = await this.favoriteService.findAll();
    return response;
  }

  @Get('/:ticker')
  async getIsFavorite(@Param() params: any): Promise<boolean> {
    const response = await this.favoriteService.findOne(params.ticker);
    if (response) return true;
    return false;
  }

  @Post('/:ticker')
  async save(@Param() params: any): Promise<Favorite> {
    const response = await this.favoriteService.create({
      ticker: params.ticker,
    });
    return response;
  }

  @Delete('/:ticker')
  async remove(@Param() params: any): Promise<void> {
    const response = await this.favoriteService.delete(params.ticker);
    return response;
  }
}
