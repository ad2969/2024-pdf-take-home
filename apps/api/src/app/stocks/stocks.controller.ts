import { Controller, Get, Param } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { Stock } from '@2024-pdf-take-home/domain';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get(':id')
  async query(@Param() params: any): Promise<Stock[]> {
    const response = await this.stocksService.fetchTickers(params.id);
    return response.results;
  }
}
