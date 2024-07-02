import { Component, OnInit, Input, OnDestroy, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription, of } from 'rxjs';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

import { ApiService } from '../../api/api.service';
import { Stock } from '@2024-pdf-take-home/domain';

@Component({
  selector: 'fse-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  standalone: true,
  imports: [
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
  ]
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Input() initialValue = '';
  @Input() debounceTime = 1000;
  
  inputValue = new Subject<string>();
  trigger = this.inputValue.pipe(
    debounceTime(this.debounceTime),
    distinctUntilChanged()
  );
  subscriptions: Subscription[] = [];
  
  lookupResults$: Observable<Stock[]> = of([]);
  
  private readonly apiService = inject(ApiService);
  constructor (
    public router: Router,
  ) {
  }
  
  ngOnInit() {
    const subscription = this.trigger.subscribe(currentValue => {
      if (currentValue === '') return;
      this.lookupResults$ = this.apiService.lookupStocksByTicker(currentValue);
    });
    this.subscriptions.push(subscription);
  }
  
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  onSearch(e: any) {
    this.inputValue.next(e.target.value);
  }
  
  clickStock(stockId: string) {
    this.router.navigate([`/stock/${stockId}`])
  }
}
