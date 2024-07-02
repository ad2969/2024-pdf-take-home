import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bar, News, Stock } from "@2024-pdf-take-home/domain";

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private readonly http = inject(HttpClient);

    lookupStocksByTicker(query: string): Observable<Stock[]> {
        return this.http.get<Stock[]>(`/api/stocks/tickers/${query}`);
    }

    getTickerData(ticker: string): Observable<Stock> {
        return this.http.get<Stock>(`/api/stocks/tickers/${ticker}/detail`);
    }

    getTickerBarData(ticker: string, from: number, to: number): Observable<Bar[]> {
        return this.http.get<Bar[]>(`/api/stocks/data/${ticker}/${from}/${to}`);
    }

    getTickerNewsData(ticker: string): Observable<News[]> {
        return this.http.get<News[]>(`/api/stocks/news/${ticker}`);
    }
 
    getAllFavoriteStocks(): Observable<Stock[]> {
        return this.http.get<Stock[]>(`/api/favorites`);
    }
    
    createFavoriteStock(stockId: string): Observable<unknown> {
        return this.http.post(`/api/favorites`, stockId);
    }
    
    deleteFavoriteStock(stockId: string): Observable<unknown> {
        return this.http.delete(`/api/favorites/${stockId}`);
    }
}
