import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Stock } from "@2024-pdf-take-home/domain";

type SymbolLookupResponse = {
    count: number;
    result: Stock[];
}

const BASE_URL = 'https://finnhub.io/api/v1';
const AUTH_HEADERS = {
    'X-Finnhub-Token': process.env.FINNHUB_API_KEY

}

@Injectable()
export class StocksService {
    constructor(private readonly httpService: HttpService) {}

    async fetchSymbol(queryString: string): Promise<SymbolLookupResponse> {
        //  Get TodoTypicodeResponse using axios
        const response = await lastValueFrom(
            this.httpService.get(
                `${BASE_URL}/search`,
                {
                    headers: AUTH_HEADERS,
                    params: {
                        q: queryString,
                    },
                }
            ),
        ).catch((err) => {
            console.error(err);
        });

        if (!response) return { count: 0, result: [] }
        return response.data;
    }
}
