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
    <div
      style={{
        backgroundColor: 'rgb(32, 33, 36)',
        minHeight: '100vh',
        padding: '40px 32px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {TIME_RANGES.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                backgroundColor: r === range ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: r === range ? '#f3f4f6' : '#6b7280',
                transition: 'all 0.15s',
              }}>
              {r}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600 }}>
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
