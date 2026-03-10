import '@src/NewTab.css';
import '@src/NewTab.scss';
import { useState } from 'react';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import TrackerCard from '@src/TrackerCard';
import { usePriceData } from '@src/api/usePriceData';
import type { TimeRange } from '@src/mockData';

const TIME_RANGES: TimeRange[] = ['1D', '1W', '1M', '1Y', '5Y'];

const TV_TIMEFRAMES: Record<TimeRange, string> = {
  '1D': '1D',
  '1W': '5D',
  '1M': '1M',
  '1Y': '12M',
  '5Y': '60M',
};

const NewTab = () => {
  const [range, setRange] = useState<TimeRange>('1W');
  const { gold, oil, loading, error } = usePriceData(range);

  return (
    <div className="min-h-screen bg-[rgb(32,33,36)] px-8 py-10 font-sans">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-5 flex gap-2">
          {TIME_RANGES.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`cursor-pointer rounded-md border-none px-3.5 py-1.5 text-[13px] font-medium transition-all duration-150 ${
                r === range ? 'bg-white/[.12] text-gray-100' : 'bg-transparent text-gray-500'
              }`}>
              {r}
            </button>
          ))}
        </div>

        {error && <div className="mb-4 text-sm text-red-400">{error}</div>}

        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : (
          <div className="flex max-w-[600px] flex-col gap-4">
            {gold.length >= 2 && (
              <TrackerCard
                title="Gold"
                data={gold}
                color="#facc15"
                unit="$"
                href={`https://www.tradingview.com/symbols/XAUUSD/?timeframe=${TV_TIMEFRAMES[range]}`}
              />
            )}
            {oil.length >= 2 && (
              <TrackerCard
                title="Crude Oil (WTI)"
                data={oil}
                color="#38bdf8"
                unit="$"
                href={`https://www.tradingview.com/symbols/USOIL/?timeframe=${TV_TIMEFRAMES[range]}`}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <div>Loading...</div>), <div>Error</div>);
