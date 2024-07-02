import { Trade } from '@2024-pdf-take-home/domain';
import { Server } from 'socket.io';

const tickerClientSubscriptions: {[ticker: string]: Set<string>} = {};
const clientTickerSubscriptions: {[clientId: string]: Set<string>} = {};
const trackedTickers: {[ticker: string]: {
    lastPrice: number;
    interval?: NodeJS.Timeout;
}} = {};

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}
function getNextPrice(lastPrice: number) {
    return +Number((1.0500 - Math.random() * 0.0500) * lastPrice).toFixed(2);
}
function getRandomTradeSize() {
    return getRandomInt(1000);
}

export function getClientTickerSubscription(clientId: string, ticker: string) {
    return `client:${clientId}-ticker:${ticker}`;
}

export function sendToClient(
    server: Server,
    clientId: string,
    ticker: string,
    payload: Trade,
) {
    server.to(clientId).emit('new', payload);
}

const EXCHANGES = ['NYSE', 'TSX', 'ARCA', 'NASDAQ', 'DJI', ]

export function startClientTickerSubscription(
    server: Server,
    clientId: string,
    ticker: string,
    lastPrice: number,
) {
    if (ticker in tickerClientSubscriptions && tickerClientSubscriptions[ticker].size) {
        // already have existing subscription
        if (!tickerClientSubscriptions[ticker].has(clientId)) {
            tickerClientSubscriptions[ticker].add(clientId);
            clientTickerSubscriptions[clientId].add(ticker);
        }
        return;
    }

    // first subscription
    tickerClientSubscriptions[ticker] = new Set ([clientId]);
    clientTickerSubscriptions[clientId] = new Set ([ticker]);
    trackedTickers[ticker] = { lastPrice };

    const subscription = setInterval(function () {
        const ts = Date.now();
        const newTrade: Trade = {
            id: `${ticker}-${ts}`,
            ticker: ticker,
            exchange: EXCHANGES[getRandomInt(5)],
            price: getNextPrice(trackedTickers[ticker].lastPrice),
            size: getRandomTradeSize(),
            timestamp: ts,
        }

        trackedTickers[ticker].lastPrice = newTrade.price;
        
        tickerClientSubscriptions[ticker].forEach((cliId) => {
            sendToClient(server, cliId, ticker, newTrade);
        })
    }, 1000);

    trackedTickers[ticker].interval = subscription;
}

export function stopClientTickerSubscription(clientId: string, ticker: string) {
    tickerClientSubscriptions[ticker].delete(clientId);
    clientTickerSubscriptions[clientId].delete(ticker);

    if (tickerClientSubscriptions[ticker].size === 0) {
        clearInterval(trackedTickers[ticker].interval);

    }
}

export function stopAllClientSubscriptions(clientId: string) {
    if (!(clientId in clientTickerSubscriptions)) return;
    if (!clientTickerSubscriptions[clientId].size) return;
    
    const tickers = Array.from(clientTickerSubscriptions[clientId]);
    tickers.forEach((ticker) => stopClientTickerSubscription(clientId, ticker));
}