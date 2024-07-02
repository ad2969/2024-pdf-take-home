import { Component, Input, inject, OnInit, OnDestroy } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { AsyncPipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';
import * as HighCharts from 'highcharts/highstock';

import { ApiService } from '../api/api.service';
import { Bar } from '@2024-pdf-take-home/domain';

const TWO_YEARS = 63113904000;
const ONE_MONTH = 2629746000;

@Component({
  selector: 'fse-stock-analysis',
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.scss',
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    HighchartsChartModule,
  ]
})
export class StockAnalysisComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute, private router: Router) {
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
  
  tickerData = new Subject<Bar[]>();
  
  ngOnInit() {
    const curr = Date.now();
    const initRange = [curr - TWO_YEARS, curr]
    const observer = this.apiService.getTickerBarData(this.ticker, initRange[0], initRange[1]);
    observer.pipe(map((result) => { this.tickerData.next(result) })).subscribe();

    const dataSubscription = this.tickerData.subscribe(newData => {
      this.updateCandleChart(newData);
      this.capCandleChartView();
    })
    this.subscriptions.push(dataSubscription);
  }
  
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  // onChangeDates(e: any) {
  //   this.dateRange.next(e.target.value);
  // }

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

  updateCandleChart(data: Bar[]) {
    this.candleChartOptions.series = [{
      name: 'Stock Price',
      type: 'candlestick',
      data: data.map((bar: Bar) => [bar.t, bar.o, bar.h, bar.l, bar.c]),
    }];
    this.candleChartUpdateFlag = true;
  }

  capCandleChartView() {
    // set date ranges to only show recent range
    const lastDate = this.candleChart?.xAxis[0].getExtremes().dataMax || Date.now();
    this.candleChart?.xAxis[0].setExtremes(lastDate - ONE_MONTH, lastDate, true)
    this.candleChartUpdateFlag = true;
  }

  // BREAKPOINTS

  private breakpointObserver = inject(BreakpointObserver);

  /** Based on the screen size, switch from standard to one column per row */
  isHandheld = this.breakpointObserver.observe(Breakpoints.Handset);
  cards = this.isHandheld.pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 2', cols: 2, rows: 2 },
          { title: 'Card 4', cols: 2, rows: 2 },
          { title: 'List', cols: 2, rows: 3 },
        ];
      }

      return [
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'List', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 },
      ];
    })
  );
}
