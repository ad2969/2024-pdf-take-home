import { Controller, Get, Param } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { OHCLVT, Stock, News } from '@2024-pdf-take-home/domain';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('/:query')
  async queryTicker(@Param() params: any): Promise<Stock[]> {
    const response = await this.stocksService.fetchTickers(params.query);
    return response.results;
  }

  @Get('/:ticker/detail')
  async getTickerData(@Param() params: any): Promise<Stock> {
    const response = await this.stocksService.fetchTickerData(params.ticker);
    return response.results;
  }

  @Get('/:ticker/data/:from/:to')
  async getOHLCVTData(@Param() params: any): Promise<OHCLVT[]> {
    const response = await this.stocksService.fetchOHLCVT(params.ticker, params.from, params.to);
    return response.results;
  }

  @Get('/:ticker/news')
  async getNews(@Param() params: any): Promise<News[]> {
    const response = await this.stocksService.fetchNews(params.ticker);
    return response.results;
  }
}
