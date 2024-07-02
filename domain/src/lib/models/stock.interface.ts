export interface Stock {
    ticker: string;
    name: string;
    market: string;
    locale: string;
    primary_exchange: string;
    type: string;
    active: boolean,
    currency_name: string;
    cik: string;
    composite_figi: string;
    share_class_figi: string;
    last_updated_utc: string;

    description?: string;
    list_date?: string;
    homepage_url?: string;
    market_cap?: number;
    phone_number?: string;
    round_lot?: number;
    address?: {
        address1: string;
        city: string;
        postal_code: string;
        state: string;
    }
    branding?: {
        icon_url: string;
        logo_url: string;
    }
}