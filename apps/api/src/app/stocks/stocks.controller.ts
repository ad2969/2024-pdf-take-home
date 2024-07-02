import { Controller, Get, Param } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { Bar, Stock, News } from '@2024-pdf-take-home/domain';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('/tickers/:query')
  async queryTicker(@Param() params: any): Promise<Stock[]> {
    const response = await this.stocksService.fetchTickers(params.query);
    return response.results;
  }

  @Get('/data/:ticker/:from/:to')
  async getCandleData(@Param() params: any): Promise<Bar[]> {
    const response = await this.stocksService.fetchCandles(params.ticker, params.from, params.to);
    return response.results;
  }

  @Get('/news/:ticker')
  async getNews(@Param() params: any): Promise<News[]> {
    const response = await this.stocksService.fetchNews(params.ticker);
    return response.results;
  }
}
