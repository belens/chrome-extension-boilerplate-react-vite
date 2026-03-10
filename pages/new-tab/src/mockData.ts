type TimeRange = '1D' | '1W' | '1M' | '1Y' | '5Y';

interface PricePoint {
  timestamp: number;
  value: number;
}

function generateMockPrices(
  basePrice: number,
  volatility: number,
  count: number,
  startTime: number,
  intervalMs: number,
): PricePoint[] {
  const points: PricePoint[] = [];
  let price = basePrice;

  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.48) * volatility;
    price = Math.max(price * 0.8, price + change);
    points.push({
      timestamp: startTime + i * intervalMs,
      value: Math.round(price * 100) / 100,
    });
  }

  return points;
}

const HOUR = 3600 * 1000;
const DAY = 24 * HOUR;

const rangeConfig: Record<TimeRange, { count: number; intervalMs: number }> = {
  '1D': { count: 96, intervalMs: 15 * 60 * 1000 },
  '1W': { count: 168, intervalMs: HOUR },
  '1M': { count: 30, intervalMs: DAY },
  '1Y': { count: 365, intervalMs: DAY },
  '5Y': { count: 260, intervalMs: 7 * DAY },
};

export function getMockData(range: TimeRange): { gold: PricePoint[]; oil: PricePoint[] } {
  const { count, intervalMs } = rangeConfig[range];
  const now = Date.now();
  const startTime = now - count * intervalMs;

  return {
    gold: generateMockPrices(2920, 8, count, startTime, intervalMs),
    oil: generateMockPrices(68, 0.5, count, startTime, intervalMs),
  };
}

export type { TimeRange, PricePoint };
