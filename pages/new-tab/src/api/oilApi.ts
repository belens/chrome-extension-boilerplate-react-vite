import { getCached, setCache } from './cache';
import type { PricePoint } from '@src/mockData';

const API_KEY = '4R854WFQ7ZBM5YOU';
const DAILY_CACHE_KEY = 'oil_daily';
const MONTHLY_CACHE_KEY = 'oil_monthly';
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

interface AlphaVantageResponse {
  data: { date: string; value: string }[];
}

async function fetchOilData(interval: 'daily' | 'monthly', cacheKey: string): Promise<PricePoint[]> {
  const cached = await getCached<PricePoint[]>(cacheKey, CACHE_MAX_AGE);
  if (cached !== null) return cached;

  const url = `https://www.alphavantage.co/query?function=WTI&interval=${interval}&apikey=${API_KEY}`;
  const res = await fetch(url);
  const raw: AlphaVantageResponse = await res.json();

  const points: PricePoint[] = raw.data
    .filter(d => d.value !== '.')
    .map(d => ({
      timestamp: new Date(d.date).getTime(),
      value: parseFloat(d.value),
    }));

  points.sort((a, b) => a.timestamp - b.timestamp);
  await setCache(cacheKey, points);
  return points;
}

export async function fetchOilDaily(): Promise<PricePoint[]> {
  return fetchOilData('daily', DAILY_CACHE_KEY);
}

export async function fetchOilMonthly(): Promise<PricePoint[]> {
  return fetchOilData('monthly', MONTHLY_CACHE_KEY);
}
