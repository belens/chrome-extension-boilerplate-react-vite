import { getCached, setCache } from './cache';
import type { PricePoint } from '@src/mockData';
import type { TimeRange } from '@src/mockData';

const RANGE_CONFIG: Record<TimeRange, { range: string; interval: string; cacheMaxAge: number }> = {
  '1D': { range: '1d', interval: '5m', cacheMaxAge: 5 * 60 * 1000 },
  '1W': { range: '5d', interval: '15m', cacheMaxAge: 15 * 60 * 1000 },
  '1M': { range: '1mo', interval: '1d', cacheMaxAge: 60 * 60 * 1000 },
  '1Y': { range: '1y', interval: '1d', cacheMaxAge: 60 * 60 * 1000 },
  '5Y': { range: '5y', interval: '1wk', cacheMaxAge: 24 * 60 * 60 * 1000 },
};

interface YahooChartResponse {
  chart: {
    result: [
      {
        meta: { regularMarketPrice: number };
        timestamp: number[];
        indicators: {
          quote: [{ close: (number | null)[] }];
        };
      },
    ];
    error: unknown;
  };
}

export async function fetchPriceData(symbol: string, timeRange: TimeRange): Promise<PricePoint[]> {
  const { range, interval, cacheMaxAge } = RANGE_CONFIG[timeRange];
  const cacheKey = `yf_${symbol}_${timeRange}`;

  const cached = await getCached<PricePoint[]>(cacheKey, cacheMaxAge);
  if (cached !== null) return cached;

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`;
  const res = await fetch(url);
  const data: YahooChartResponse = await res.json();

  const result = data.chart.result[0];
  const timestamps = result.timestamp;
  const closes = result.indicators.quote[0].close;

  const points: PricePoint[] = [];
  for (let i = 0; i < timestamps.length; i++) {
    const close = closes[i];
    if (close != null) {
      points.push({ timestamp: timestamps[i] * 1000, value: close });
    }
  }

  await setCache(cacheKey, points);
  return points;
}
