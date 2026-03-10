import '@src/NewTab.css';
import '@src/NewTab.scss';
import { useState, useMemo } from 'react';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import TrackerCard from '@src/TrackerCard';
import { getMockData } from '@src/mockData';
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
  const data = useMemo(() => getMockData(range), [range]);

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

        <div className="flex max-w-[600px] flex-col gap-4">
          <TrackerCard
            title="Gold"
            data={data.gold}
            color="#facc15"
            unit="$"
            href={`https://www.tradingview.com/symbols/XAUUSD/?timeframe=${TV_TIMEFRAMES[range]}`}
          />
          <TrackerCard
            title="Crude Oil (WTI)"
            data={data.oil}
            color="#38bdf8"
            unit="$"
            href={`https://www.tradingview.com/symbols/USOIL/?timeframe=${TV_TIMEFRAMES[range]}`}
          />
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <div>Loading...</div>), <div>Error</div>);
