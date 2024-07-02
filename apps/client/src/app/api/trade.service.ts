import { Trade } from '@2024-pdf-take-home/domain';
import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const socketConfig: SocketIoConfig = {
  url: 'http://localhost:3000',
  options: {},
};

@Injectable({
  providedIn: 'root'
})
export class TradeService extends Socket {
  constructor() {
    super(socketConfig);
  }

  subscribe(ticker: string, lastPrice: number) {
    this.emit('sub', JSON.stringify({ ticker, lastPrice }));
  }
  unsubscribe(ticker: string) {
    this.emit('unsub', JSON.stringify({ ticker }));
  }
  getMessage(): Observable<Trade> {
    return this.fromEvent('new').pipe(map((data: any) => data));
  }
}
