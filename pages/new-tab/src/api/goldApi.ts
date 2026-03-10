import { getCached, setCache } from './cache';
import type { PricePoint } from '@src/mockData';

const SPOT_CACHE_KEY = 'gold_spot';
const HISTORY_CACHE_KEY = 'gold_history';
const SPOT_MAX_AGE = 5 * 60 * 1000; // 5 minutes
const HISTORY_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

interface GoldSpotResponse {
  price: number;
  updatedAt: string;
}

interface FreeGoldEntry {
  date: string;
  price: number;
  source: string;
}

export async function fetchGoldSpotPrice(): Promise<number> {
  const cached = await getCached<number>(SPOT_CACHE_KEY, SPOT_MAX_AGE);
  if (cached !== null) return cached;

  const res = await fetch('https://api.gold-api.com/price/XAU');
  const data: GoldSpotResponse = await res.json();
  await setCache(SPOT_CACHE_KEY, data.price);
  return data.price;
}

export async function fetchGoldHistory(): Promise<PricePoint[]> {
  const cached = await getCached<PricePoint[]>(HISTORY_CACHE_KEY, HISTORY_MAX_AGE);
  if (cached !== null) return cached;

  const res = await fetch('https://freegoldapi.com/data/latest.json');
  const raw: FreeGoldEntry[] = await res.json();

  // Use worldbank (monthly, 2000-2024) + yahoo_finance (daily, 2025+) for USD data
  const usdSources = new Set(['worldbank', 'yahoo_finance']);
  const usdEntries = raw.filter(e => usdSources.has(e.source) && e.date >= '2000-01-01');

  const points: PricePoint[] = usdEntries.map(e => ({
    timestamp: new Date(e.date).getTime(),
    value: e.price,
  }));

  points.sort((a, b) => a.timestamp - b.timestamp);
  await setCache(HISTORY_CACHE_KEY, points);
  return points;
}
