# PHOENIX AI 2.0 — Indian Equity Intelligence

Next.js 15 + React 19 + TypeScript. No paid API keys or database required.

## Features
- Automatic scan of a **curated 30-stock NSE universe** (3 sequential requests, 10 symbols each)
- Separate **Swing (3–15 trading days)** and **Positional (1–6 months)** ranked dashboards
- Technical composite scoring: moving averages, RSI, MACD, breakout and relative volume
- ATR-based **illustrative** entry reference, stop-loss, 2R/3R targets, reward/risk
- Manual NSE ticker lookup, signal explanations, source/candle timestamps, errors
- Suppresses trade levels when candles are stale (>5 calendar days) or indicators missing
- Free unofficial Yahoo Finance daily chart endpoint, cached 15 minutes; no guaranteed live quotes

## Deployment
1. Extract ZIP; upload the **contents** of this folder to the root of a GitHub repository.
2. In Vercel, import the repository. Framework preset: Next.js. Root directory: `./`.
3. `npm install && npm run build` locally or let Vercel build automatically.
4. No environment variables required. Hobby plan: scans use **three independent short serverless requests**, rather than one 30-symbol request.

## Data caveats
- Yahoo Finance chart API is unofficial and may rate-limit/block Vercel server IPs. App reports failed tickers; no mock prices are substituted.
- **Not a live market feed**. No order book, delivery data, verified fundamental statements, transaction costs, or portfolio suitability checks.
- This is a 30-symbol curated scanner, **not a whole NSE market scan**.
- Entry = last daily close; entry-high = last close + 0.25×ATR (swing) or 0.4×ATR (positional). Stop = close − 1.8×ATR (swing) or 3×ATR (positional); targets = close + 2R and +3R. These levels are **research illustrations, not trade execution recommendations**.
- A high score is not a win probability. Market closures/holidays and corporate actions can affect freshness and levels.
- No automated trading. Not SEBI-registered investment advice.

## Production improvements
Connect an authorized Indian broker market-data API with proper authentication and entitlements; use an EOD database and scheduled scanning; incorporate verified company filings/fundamentals, liquidity filters, market regime, transaction costs, historical walk-forward backtests, and exchange holidays. Avoid calling an API without checking commercial and redistribution terms.
