import '@src/NewTab.css';
import '@src/NewTab.scss';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import TradingViewWidget from '@src/TradingViewWidget';

const NewTab = () => {
  return (
    <div className="min-h-screen bg-[rgb(32,33,36)] px-8 py-10 font-sans">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4">
        <TradingViewWidget symbols={[['Gold', 'TVC:GOLD|1D']]} width={600} height={300} />
        <TradingViewWidget symbols={[['Crude Oil WTI', 'TVC:USOIL|1D']]} width={600} height={300} />
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <div>Loading...</div>), <div>Error</div>);
