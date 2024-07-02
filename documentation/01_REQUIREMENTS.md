## Basic Requirements
### Frontend
- Angular
- Angular Material
- D3.js or Highcaharts
### Backend
- RESTful API using Node.js and Express
- Websocket Implementation for real-time data streaming
- MongoDB

### Features
- Real-time visualization of stock market trend
    - Candlestick Charts, Line Graphs, Comparative Analysis Tool
- Filters
    - Selecting stocks
    - Time Frames
    - Financial Indicators
- User Preferences
    - Favorite Stocks
    - Custom Dashboard Setups


## Initial Dev Decisions
- Monorepo Structure: for ease of submission and management
    - Use [Nx](https://nx.dev/) to set up monorepo
- Highcharts for Data Visualization
    - Although D3.js offers more customizability and flexibility, the priority is speed of setup
- Frontend: [Angular](https://angular.dev/)
- Backend: Nest.js REST API
    - [Nest.js](https://nestjs.com/) is an abstraction on top of Express.js
    - Use because it is more aligned with the opiniated approach of Angular, provides out-of-the-box Typescript support, and designed for maintainability + scalability.
    - Nx also offers built-in templates for Angular + Nest.js
- Data API: [Polygon.io](https://polygon.io/) (see decision [below](#data-api))

### Data API
API | Strengths | Weaknesses | Opportunities | Threats
-- | -- | -- | -- | --
Alpha Vantage | Global coverage | Limited real-time data | N/A | N/A
IEX Cloud | Generous free tier | Only US Data, limited statement data | N/A | [retirement of all IEX Cloud products on August 31, 2024](https://iexcloud.io/product-bulletin)
Polygon.io | Websocket API available, High rate limit | Only US Data | N/A | N/A
Finnhub | Global coverage, extensive alternative data (news, sentinment analysis) | High price for premium plan | N/A | N/A

#### Free Plan
Because this project relies initially on the free plan, it might be smart to consider the pros/cons of the free plans of the respective APIs.

API | Requests | Data Coverage | Support | Features
-- | -- | -- | -- | --
Alpha Vantage | Up to 500/day | Global stocks, ETFs, mutual funds, forex | Community forums, documentation | Time series data, technical indicators
IEX Cloud | 250,000/month | US stocks, forex, crypto, economic data | Community support, documentation | Stock prices, financials, news, stats
Polygon.io | 5/minute, up to 500/day | US stocks, forex, crypto | Community support, documentation | Real-time/delayed data, aggregated data, news
Finnhub | 60/minute, up to 30,000/month | Global stocks, forex, crypto, economic data | Community support, knowledge base | Fundamental data, technical indicators, news

#### Weighted Decision Matrix, for Free Plan

API | Real-time OHLCV and Price Data (30%) | Data Coverage (20%) | Integration (15%) | Support and Documentation (15%) | API Limits and Pricing (10%) | Websocket Support (10%) | **Total**
-- | -- | -- | -- | -- | -- | -- | --
Alpha Vantage | 3 | 4 | 4 | 3 | 3 | 1 | **3.15**
IEX Cloud | 4 | 4 | 1 | 4 | 4 | 1 | **3.25**
Polygon.io | 5 | 2 | 5 | 4 | 3 | 5 | **4.05**
Finnhub | 1 | 5 | 4 | 4 | 3 | 4 | **3.2**

> Based on the weighted decision matrix, we pick Polygon.io for the API