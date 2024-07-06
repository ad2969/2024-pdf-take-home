import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OHCLVT, News, Stock } from "@2024-pdf-take-home/domain";

const API_URL = process.env['NGX_API_URL'] || 'http://localhost:3000';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private readonly http = inject(HttpClient);

    lookupStocksByTicker(query: string): Observable<Stock[]> {
        return this.http.get<Stock[]>(`${API_URL}/api/stocks/${query}`);
    }

    getStockData(ticker: string): Observable<Stock> {
        return this.http.get<Stock>(`${API_URL}/api/stocks/${ticker}/detail`);
    }

    getStockOHLCVTData(ticker: string, from: number, to: number): Observable<OHCLVT[]> {
        return this.http.get<OHCLVT[]>(`${API_URL}/api/stocks/${ticker}/data/${from}/${to}`);
    }

    getStockNewsData(ticker: string): Observable<News[]> {
        return this.http.get<News[]>(`${API_URL}/api/stocks/${ticker}/news`);
    }
 
    getAllFavoriteStocks(): Observable<Stock[]> {
        return this.http.get<Stock[]>(`${API_URL}/api/favorites`);
    }
    
    saveFavoriteStock(stockId: string): Observable<unknown> {
        return this.http.post(`${API_URL}/api/favorites`, stockId);
    }
    
    removeFavoriteStock(stockId: string): Observable<unknown> {
        return this.http.delete(`${API_URL}/api/favorites/${stockId}`);
    }
}
