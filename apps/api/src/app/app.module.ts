import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { StocksModule } from './stocks/stocks.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TradesGateway } from './trades/trades.gateway';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // for env vars
    StocksModule,
    FavoritesModule,
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_URL),
  ],
  controllers: [AppController],
  providers: [AppService, TradesGateway],
})
export class AppModule {}
