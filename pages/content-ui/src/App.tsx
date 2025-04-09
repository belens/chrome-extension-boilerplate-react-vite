import { useEffect } from 'react';
import { ToggleButton } from '@extension/ui';
import { exampleThemeStorage } from '@extension/storage';
import { t } from '@extension/i18n';
import { useStorage } from '@extension/shared';

export default function App() {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';

  useEffect(() => {
    console.log('content ui loaded');
  }, []);

  return (
    <div
      className={`fixed bottom-0 flex items-center justify-between gap-2 rounded bg-gray-800 px-2 py-1 ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`}
      style={{ zIndex: 9999 }}>
      <ToggleButton onClick={exampleThemeStorage.toggle}>{t('toggleTheme')}</ToggleButton>
    </div>
  );
}
