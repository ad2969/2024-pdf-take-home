export interface Trade {
    id: string;
    ticker: string;
    exchange: string;
    price: number;
    size: number;
    timestamp: number;
}