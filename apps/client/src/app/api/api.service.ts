import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock } from "@2024-pdf-take-home/domain";

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private readonly http = inject(HttpClient);

    lookupStocksByQuery(query: string): Observable<Stock[]> {
        return this.http.get<Stock[]>(`/api/stocks/${query}`);
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
