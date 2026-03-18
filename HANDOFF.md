# Handoff Document — Sancorp Chrome Extension

## Goal

Build a personal Chrome extension with a new tab page featuring real-time commodity/stock price trackers with interactive charts.

## Current Progress

### Completed

- **Repository synced** to latest upstream (`origin/main`), local branch is `master`
- **New tab page** displays gold (GC=F) and crude oil WTI (CL=F) price tracker cards
- **Real-time data** via Yahoo Finance chart API (`query1.finance.yahoo.com/v8/finance/chart/`)
  - 1D: 5-minute intervals, cached 5 min
  - 1W: 15-minute intervals, cached 15 min
  - 1M: daily, cached 1 hour
  - 1Y: daily, cached 1 hour
  - 5Y: weekly, cached 24 hours
- **Caching** in `chrome.storage.local` with per-key TTLs
- **Charts** using uPlot (`uplot` + `uplot-react`) — lightweight canvas-based
- **Hover tooltip** shows date/time and value on chart hover
- **TradingView links** on card titles with matching timeframe parameter
- **Styling** uses Tailwind CSS, dark mode only (background: `rgb(32, 33, 36)`)
- **Time range selector**: 1D, 1W (default), 1M, 1Y, 5Y buttons
- **TradingView Symbol Overview widget** embedded side-by-side with our implementation for comparison
  - Uses direct iframe to `https://www.tradingview-widget.com/embed-widget/symbol-overview/` with config in URL hash
  - CSP relaxed via `content_security_policy.extension_pages` with `frame-src` for tradingview domains
  - Free-tier symbols: `TVC:GOLD`, `TVC:USOIL`

### Key Files

- `pages/new-tab/src/NewTab.tsx` — main component, side-by-side layout (our cards left, TradingView widget right)
- `pages/new-tab/src/TrackerCard.tsx` — price card with title link, change %, chart
- `pages/new-tab/src/PriceChart.tsx` — uPlot wrapper with resize observer and tooltip plugin
- `pages/new-tab/src/TradingViewWidget.tsx` — TradingView Symbol Overview widget via iframe embed
- `pages/new-tab/src/api/yahooFinance.ts` — Yahoo Finance API fetcher (active)
- `pages/new-tab/src/api/cache.ts` — chrome.storage.local caching layer
- `pages/new-tab/src/api/usePriceData.ts` — React hook combining gold + oil data
- `pages/new-tab/src/api/goldApi.ts` — **UNUSED**, old gold-api.com + FreeGoldAPI integration
- `pages/new-tab/src/api/oilApi.ts` — **UNUSED**, old Alpha Vantage integration
- `pages/new-tab/src/mockData.ts` — types (`TimeRange`, `PricePoint`) + unused mock data generator
- `chrome-extension/manifest.ts` — manifest with `host_permissions`, `content_security_policy` for TradingView iframe

## What Worked

- **Yahoo Finance chart API** is the best single source — free, no API key, intraday data, supports both commodities and stocks via futures symbols (GC=F, CL=F, etc.)
- **uPlot** is tiny (~14KB gzipped) and renders well for time series
- **`pnpm dev`** for hot reload during development (much faster than `pnpm build`)
- **Tailwind CSS** with arbitrary values (`bg-[rgb(32,33,36)]`) for custom colors
- Chrome extension `host_permissions: ['<all_urls>']` bypasses CORS for Yahoo Finance
- **Direct iframe embed for TradingView widget** — skip the JS script, embed the hosted widget page directly with config in URL hash

## What Didn't Work

- **gold-api.com + FreeGoldAPI** — gold-api.com is fine for spot price but FreeGoldAPI historical data is monthly (worldbank source) or daily only from Jan 2025 (yahoo_finance source), leaving gaps. Not suitable for intraday.
- **Alpha Vantage** — only daily close data for commodities, 25 req/day limit, no intraday for WTI/Brent
- **TradingView widget via external script in sandbox page** — Chrome MV3 sandbox pages still block remote `script-src`. Even with custom sandbox CSP allowing the script domain, the widget creates nested iframes to `tradingview-widget.com` which need further CSP relaxation, plus cookie access needs `allow-same-origin`. Too many layered CSP issues.
- **Direct iframe to TradingView S3 URL** — `s3.tradingview.com/external-embedding/embed-widget-symbol-overview.html` returns AccessDenied; it's only meant to be loaded by their JS script.
- **TradingView futures symbols in free widget** — `COMEX:GC1!`, `NYMEX:CL1!` show "only available on TradingView". Use `TVC:GOLD`, `TVC:USOIL` instead.
- **`pnpm build`** from sandbox fails due to pnpx cache dir permissions — needs `dangerouslyDisableSandbox: true`
- **pnpm not in PATH** — must use full path `/Users/sanderbelen/.nvm/versions/node/v22.12.0/bin/pnpm` or set PATH for git hooks

## Build Notes

- pnpm binary: `/Users/sanderbelen/.nvm/versions/node/v22.12.0/bin/pnpm`
- Node version per `.nvmrc`: v22.12.0
- Build/dev commands need `dangerouslyDisableSandbox: true`
- Git commits need `PATH="/Users/sanderbelen/.nvm/versions/node/v22.12.0/bin:$PATH"` for husky pre-commit hooks
- **Use `pnpm dev` during development**, only `pnpm build` for production
- Alpha Vantage API key (if needed later): `4R854WFQ7ZBM5YOU`

## Next Steps

1. **Compare implementations** — evaluate TradingView widget vs our uPlot implementation, decide which to keep long-term
2. **Clean up unused files** — remove `goldApi.ts`, `oilApi.ts`, mock generator in `mockData.ts`
3. **Add stock trackers** — just add more `<TrackerCard>` entries with Yahoo Finance stock symbols (e.g. `AAPL`, `NVDA`)
4. **Consider grid layout** — once more cards are added, switch from single column to 2-column grid
5. **Module manager** — run `pnpm module-manager` to remove unused extension pages (popup, side-panel, options, devtools, content-ui, content-runtime, content) to slim down the build
6. **Takeover feature** — existing YouTube takeover component in `pages/content-ui/src/Takeover.tsx` from a previous commit; decide whether to keep or remove
