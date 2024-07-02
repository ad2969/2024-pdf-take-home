export interface News {
    amp_url: string;
    article_url: string;
    author: string;
    description: string;
    id: string;
    image_url: string;
    keywords: string[];
    published_utc: string;
    publisher: {
        favicon_url: string;
        homepage_url: string;
        logo_url: string;
        name: string;
    };
    tickers: string[];
    title: string;
}