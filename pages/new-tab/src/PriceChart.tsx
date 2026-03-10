import { useMemo, useRef, useEffect, useState } from 'react';
import UplotReact from 'uplot-react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import type { PricePoint } from '@src/mockData';

interface PriceChartProps {
  data: PricePoint[];
  color: string;
  label: string;
  unit: string;
}

function formatTooltipDate(ts: number): string {
  const d = new Date(ts * 1000);
  const day = d.getDate();
  const month = d.toLocaleString('en', { month: 'short' });
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const mins = d.getMinutes().toString().padStart(2, '0');
  return `${day} ${month} ${year}, ${hours}:${mins}`;
}

export default function PriceChart({ data, color, label, unit }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(400);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const uData: uPlot.AlignedData = useMemo(() => {
    const timestamps = data.map(p => p.timestamp / 1000);
    const values = data.map(p => p.value);
    return [timestamps, values];
  }, [data]);

  const opts = useMemo(
    (): uPlot.Options => ({
      width,
      height: 160,
      padding: [8, 0, 0, 0],
      plugins: [
        {
          hooks: {
            setCursor: (u: uPlot) => {
              const tooltip = tooltipRef.current;
              if (!tooltip) return;
              const idx = u.cursor.idx;
              if (idx == null) {
                tooltip.classList.add('hidden');
                return;
              }
              const ts = u.data[0][idx];
              const val = u.data[1][idx];
              if (ts == null || val == null) {
                tooltip.classList.add('hidden');
                return;
              }
              tooltip.classList.remove('hidden');
              tooltip.textContent = `${formatTooltipDate(ts)}  ${unit}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              const left = u.valToPos(ts, 'x');
              tooltip.style.left = `${left}px`;
            },
          },
        },
      ],
      cursor: {
        show: true,
        x: true,
        y: false,
        points: {
          show: false,
        },
      },
      legend: { show: false },
      axes: [
        {
          stroke: '#6b7280',
          grid: { show: false },
          ticks: { show: false },
          font: '10px sans-serif',
          gap: 2,
          size: 25,
          values: (_u: uPlot, vals: number[]) =>
            vals.map(v => {
              const d = new Date(v * 1000);
              return `${d.getDate()}/${d.getMonth() + 1}`;
            }),
        },
        {
          stroke: '#6b7280',
          grid: {
            stroke: 'rgba(255,255,255,0.05)',
            width: 1,
          },
          ticks: { show: false },
          font: '10px sans-serif',
          gap: 4,
          size: 50,
          values: (_u: uPlot, vals: number[]) => vals.map(v => `${unit}${v.toLocaleString()}`),
        },
      ],
      series: [
        {},
        {
          label,
          stroke: color,
          width: 2,
          fill: `${color}15`,
        },
      ],
    }),
    [width, color, label, unit],
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute top-0 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[11px] text-gray-200"
      />
      <UplotReact options={opts} data={uData} />
    </div>
  );
}
