import PriceChart from '@src/PriceChart';
import type { PricePoint } from '@src/mockData';

interface TrackerCardProps {
  title: string;
  data: PricePoint[];
  color: string;
  unit: string;
  href: string;
}

export default function TrackerCard({ title, data, color, unit, href }: TrackerCardProps) {
  const current = data[data.length - 1];
  const previous = data[data.length - 2];
  const change = current.value - previous.value;
  const changePercent = (change / previous.value) * 100;
  const isPositive = change >= 0;

  return (
    <div
      style={{
        backgroundColor: 'rgb(41, 42, 46)',
        borderRadius: 12,
        padding: '16px 20px',
        flex: 1,
        minWidth: 0,
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#9ca3af', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#d1d5db')}
          onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>
          {title}
        </a>
        <span
          style={{
            color: isPositive ? '#34d399' : '#f87171',
            fontSize: 12,
            fontWeight: 500,
          }}>
          {isPositive ? '+' : ''}
          {change.toFixed(2)} ({isPositive ? '+' : ''}
          {changePercent.toFixed(2)}%)
        </span>
      </div>
      <div style={{ color: '#f3f4f6', fontSize: 28, fontWeight: 600, marginBottom: 12 }}>
        {unit}
        {current.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <PriceChart data={data} color={color} label={title} unit={unit} />
    </div>
  );
}
