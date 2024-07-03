import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { OHCLVT, Stock, News } from "@2024-pdf-take-home/domain";

type TickerLookupResponse = {
    count: number;
    request_id?: string;
    next_url?: string;
    status?: string;
    results: Stock[];
}

type TickerDataResponse = {
    request_id?: string;
    status?: string;
    results: Stock | null;
}

type OHLCVTResponse = {
    ticker: string;
    adjusted: boolean;
    queryCount: number;
    resultsCount: number;
    request_id?: string;
    next_url?: string;
    status?: string;
    results: OHCLVT[];
}

type NewsResponse = {
    count: number;
    next_url?: string;
    status?: string;
    request_id?: string;
    results: News[];
}

const BASE_URL = 'https://api.polygon.io';
const AUTH_HEADERS = {
    'Authorization': `Bearer ${process.env.POLYGON_API_KEY}`

}

@Injectable()
export class StocksService {
    constructor(private readonly httpService: HttpService) {}

    async fetchTickers(queryString: string): Promise<TickerLookupResponse> {
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

    async fetchTickerData(ticker: string): Promise<TickerDataResponse> {
        //  Get TodoTypicodeResponse using axios
        const response = await lastValueFrom(
            this.httpService.get(
                `${BASE_URL}/v3/reference/tickers/${ticker}`,
                {
                    headers: AUTH_HEADERS,
                    params: {},
                }
            ),
        ).catch((err) => {
            console.error(err);
        });

        if (!response) return {
            request_id: '',
            status: 'NOT_OK',
            results: null,
        }
        return response.data;
    }

    async fetchOHLCVT(ticker: string, from: number, to: number): Promise<OHLCVTResponse> {
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

    async fetchNews(ticker: string): Promise<NewsResponse> {
        //  Get TodoTypicodeResponse using axios
        const response = await lastValueFrom(
            this.httpService.get(
                `${BASE_URL}/v2/reference/news`,
                {
                    headers: AUTH_HEADERS,
                    params: {
                        ticker: ticker.toUpperCase(),
                        limit: 10,
                        sort: 'published_utc',
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
            results: []
        }
        return response.data;
    }
}
