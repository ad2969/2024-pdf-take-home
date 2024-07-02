import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StocksModule } from './stocks/stocks.module';
import { ConfigModule } from '@nestjs/config';
import { TradesGateway } from './trades/trades.gateway';

@Module({
  imports: [
    StocksModule,
    ConfigModule.forRoot(), // for env vars
  ],
  controllers: [AppController],
  providers: [AppService, TradesGateway],
})
export class AppModule {}
