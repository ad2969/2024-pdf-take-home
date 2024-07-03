import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OHCLVT, News, Stock } from "@2024-pdf-take-home/domain";

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private readonly http = inject(HttpClient);

    lookupStocksByTicker(query: string): Observable<Stock[]> {
        return this.http.get<Stock[]>(`/api/stocks/${query}`);
    }

    getStockData(ticker: string): Observable<Stock> {
        return this.http.get<Stock>(`/api/stocks/${ticker}/detail`);
    }

    getStockOHLCVTData(ticker: string, from: number, to: number): Observable<OHCLVT[]> {
        return this.http.get<OHCLVT[]>(`/api/stocks/${ticker}/data/${from}/${to}`);
    }

    getStockNewsData(ticker: string): Observable<News[]> {
        return this.http.get<News[]>(`/api/stocks/${ticker}/news`);
    }
 
    getAllFavoriteStocks(): Observable<Stock[]> {
        return this.http.get<Stock[]>(`/api/favorites`);
    }
    
    saveFavoriteStock(stockId: string): Observable<unknown> {
        return this.http.post(`/api/favorites`, stockId);
    }
    
    removeFavoriteStock(stockId: string): Observable<unknown> {
        return this.http.delete(`/api/favorites/${stockId}`);
    }
}
