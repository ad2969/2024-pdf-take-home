import { Component, Input, inject, OnInit, OnDestroy } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';

import { HighchartsChartModule } from 'highcharts-angular';
import * as HighCharts from 'highcharts/highstock';

import { ApiService } from '../api/api.service';
import { TradeService } from '../api/trade.service';
import { OHCLVT, Trade, News, Stock } from '@2024-pdf-take-home/domain';

const TWO_YEARS = 63113904000;
const ONE_MONTH = 2629746000;

@Component({
  selector: 'fse-stock-analysis',
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.scss',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatTableModule,
    HighchartsChartModule,
  ]
})
export class StockAnalysisComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute, private router: Router, private tradeService: TradeService) {
    const self = this; // eslint-disable-line
    this.candleChartCallback = chart => { self.candleChart = chart };
  }

  get ticker() {
    return this.route.snapshot.params['id'];
  }

  // TRIGGERS AND API CONNECTIONS

  @Input() debounceTime = 1000;
  
  private readonly apiService = inject(ApiService);
  
  dateRange = new Subject<number[]>();
  dateRangeTrigger = this.dateRange.pipe(
    debounceTime(this.debounceTime),
    distinctUntilChanged()
  );
  subscriptions: Subscription[] = [];
  
  stockDetails = new Subject<Stock>();
  ohlcvtData = new Subject<OHCLVT[]>();
  newsData = new Subject<News[]>();
  tradeData: Trade[] = [];
  
  ngOnInit() {
    // ticker data
    const stockDetailObserver = this.apiService.getStockData(this.ticker);
    const stockDetailSubscription = stockDetailObserver.pipe(map((result) => { this.stockDetails.next(result) })).subscribe();
    this.subscriptions.push(stockDetailSubscription);
    

    // ticker candle data
    const curr = Date.now();
    const initRange = [curr - TWO_YEARS, curr]
    const ohlcvtDataObserver = this.apiService.getStockOHLCVTData(this.ticker, initRange[0], initRange[1]);
    const ohlcvtDataSubscription = ohlcvtDataObserver.pipe(map((result) => { this.ohlcvtData.next(result) })).subscribe();
    this.subscriptions.push(ohlcvtDataSubscription);
    
    // websocket
    const tradeObserver = this.tradeService.getMessage();
    const tradeDataSubscription = tradeObserver.pipe(map((result) => { this.tradeData = [result, ...this.tradeData] })).subscribe();
    this.subscriptions.push(tradeDataSubscription);

    // news data
    const newsDataObserver = this.apiService.getStockNewsData(this.ticker);
    const newsDataSubscription = newsDataObserver.pipe(map((result) => { this.newsData.next(result) })).subscribe();
    this.subscriptions.push(newsDataSubscription);

    const dataSubscription = this.ohlcvtData.subscribe(newData => {
      this.updateCandleChart(newData);
      this.capCandleChartView();
      if (newData.length) this.tradeService.subscribe(this.ticker, newData[newData.length-1].c);
    })
    this.subscriptions.push(dataSubscription);
  }
  
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.tradeService.unsubscribe(this.ticker);
  }

  // HIGHCHARTS
  // timestamp, open, high, low, close

  Highcharts: typeof HighCharts = HighCharts;
  candleChart: HighCharts.Chart | null = null;
  candleChartUpdateFlag = false;

  candleChartOptions: Highcharts.Options = {
    responsive: {
      rules: []
    },
    series: [{
      name: 'Stock Price',
      type: 'candlestick',
		  data: [],
    }],
  }

  candleChartCallback(chart: HighCharts.Chart) {
    this.candleChart = chart;
  }

  updateCandleChart(data: OHCLVT[]) {
    this.candleChartOptions.series = [{
      name: 'Stock Price',
      type: 'candlestick',
      data: data.map((val: OHCLVT) => [val.t, val.o, val.h, val.l, val.c]),
    }];
    this.candleChartUpdateFlag = true;
  }

  capCandleChartView() {
    // set date ranges to only show recent range
    const lastDate = this.candleChart?.xAxis[0].getExtremes().dataMax || Date.now();
    this.candleChart?.xAxis[0].setExtremes(lastDate - ONE_MONTH, lastDate, true)
    this.candleChartUpdateFlag = true;
  }

  // TABLE
  displayedTradeColumns = ['timestamp', 'exchange', 'price', 'size'];

  // BREAKPOINTS

  private breakpointObserver = inject(BreakpointObserver);

  /** Based on the screen size, switch from standard to one column per row */
  isHandheld = this.breakpointObserver.observe(Breakpoints.Handset);
  cards = this.isHandheld.pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Company Info', cols: 2, rows: 2, class: 'scroll', details: true },
          { title: 'News', cols: 2, rows: 4, class: 'scroll', news: true },
          { title: 'Trades (Websocket)', cols: 2, rows: 4, class: 'scroll', trades: true },
        ];
      }

      return [
        { title: 'Company Info', cols: 1, rows: 1, class: 'scroll', details: true },
        { title: 'Trades (Websocket)', cols: 1, rows: 3, class: 'scroll', trades: true },
        { title: 'News', cols: 1, rows: 2, class: 'scroll', news: true },
      ];
    })
  );
}
