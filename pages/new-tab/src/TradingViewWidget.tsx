import { useMemo } from 'react';

interface TradingViewWidgetProps {
  symbols: [string, string][];
  width?: number;
  height?: number;
  colorTheme?: 'dark' | 'light';
}

export default function TradingViewWidget({
  symbols,
  width = 600,
  height = 300,
  colorTheme = 'dark',
}: TradingViewWidgetProps) {
  const src = useMemo(() => {
    const config = {
      symbols,
      chartOnly: false,
      width: '100%',
      height: '100%',
      locale: 'en',
      colorTheme,
      backgroundColor: 'rgba(32, 33, 36, 1)',
      fontColor: 'rgba(156, 163, 175, 1)',
      gridLineColor: 'rgba(255, 255, 255, 0.06)',
      autosize: true,
      showVolume: false,
      showMA: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: 'right',
      scaleMode: 'Normal',
      fontFamily: '-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif',
      fontSize: '10',
      noTimeScale: false,
      valuesTracking: '1',
      changeMode: 'price-and-percent',
      chartType: 'area',
      lineWidth: 2,
      lineType: 0,
      dateRanges: ['1d|1', '1w|15', '1m|30', '12m|1D', '60m|1W', 'all|1M'],
    };

    return `https://www.tradingview-widget.com/embed-widget/symbol-overview/?locale=en#${encodeURIComponent(JSON.stringify(config))}`;
  }, [symbols, colorTheme]);

  return (
    <div style={{ width, height }}>
      <iframe
        src={src}
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        title="TradingView Symbol Overview"
      />
    </div>
  );
}
