import { useState, useEffect } from 'react';
import type { TimeRange, PricePoint } from '@src/mockData';
import { fetchPriceData } from './yahooFinance';

interface PriceData {
  gold: PricePoint[];
  oil: PricePoint[];
  loading: boolean;
  error: string | null;
}

export function usePriceData(range: TimeRange): PriceData {
  const [gold, setGold] = useState<PricePoint[]>([]);
  const [oil, setOil] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [goldData, oilData] = await Promise.all([fetchPriceData('GC=F', range), fetchPriceData('CL=F', range)]);

        if (cancelled) return;
        setGold(goldData);
        setOil(oilData);
        setLoading(false);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Failed to fetch data');
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [range]);

  return { gold, oil, loading, error };
}
