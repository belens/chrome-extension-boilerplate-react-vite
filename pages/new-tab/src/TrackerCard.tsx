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
    <div className="min-w-0 flex-1 rounded-xl bg-[rgb(41,42,46)] px-5 py-4">
      <div className="mb-1 flex items-baseline justify-between">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] font-medium text-gray-400 no-underline hover:text-gray-300">
          {title}
        </a>
        <span className={`text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}
          {change.toFixed(2)} ({isPositive ? '+' : ''}
          {changePercent.toFixed(2)}%)
        </span>
      </div>
      <div className="mb-3 text-[28px] font-semibold text-gray-100">
        {unit}
        {current.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <PriceChart data={data} color={color} label={title} unit={unit} />
    </div>
  );
}
