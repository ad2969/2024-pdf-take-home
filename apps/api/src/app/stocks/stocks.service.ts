import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Bar, Stock } from "@2024-pdf-take-home/domain";

type SymbolLookupResponse = {
    count: number;
    request_id?: string;
    next_url?: string;
    status?: string;
    results: Stock[];
}

type CandlesResponse = {
    ticker: string;
    adjusted: boolean;
    queryCount: number;
    resultsCount: number;
    request_id?: string;
    next_url?: string;
    status?: string;
    results: Bar[];
}

const BASE_URL = 'https://api.polygon.io';
const AUTH_HEADERS = {
    'Authorization': `Bearer ${process.env.POLYGON_API_KEY}`

}

@Injectable()
export class StocksService {
    constructor(private readonly httpService: HttpService) {}

    async fetchTickers(queryString: string): Promise<SymbolLookupResponse> {
        //  Get TodoTypicodeResponse using axios
        const response = await lastValueFrom(
            this.httpService.get(
                `${BASE_URL}/v3/reference/tickers`,
                {
                    headers: AUTH_HEADERS,
                    params: {
                        ticker: queryString.toUpperCase(),
                        active: true,
                        limit: 20,
                    },
                }
            ),
        ).catch((err) => {
            console.error(err);
        });

        if (!response) return {
            count: 0,
            request_id: '',
            next_url: '',
            status: 'NOT_OK',
            results: [],
        }
        return response.data;
    }

    async fetchCandles(ticker: string, from: number, to: number): Promise<CandlesResponse> {
        //  Get TodoTypicodeResponse using axios
        const response = await lastValueFrom(
            this.httpService.get(
                `${BASE_URL}/v2/aggs/ticker/${ticker.toUpperCase()}/range/1/day/${from}/${to}`,
                {
                    headers: AUTH_HEADERS,
                    params: {
                        adjusted: true,
                        sort: 'asc',
                    },
                }
            ),
        ).catch((err) => {
            console.error(err);
        });

        if (!response) return {
            ticker,
            adjusted: true,
            queryCount: 0,
            resultsCount: 0,
            request_id: '',
            next_url: '',
            status: 'NOT_OK',
            results: []
        }
        return response.data;
    }
}
