import { useEffect, useState } from 'react';
import { ToggleButton } from '@extension/ui';
import { exampleThemeStorage } from '@extension/storage';
import { t } from '@extension/i18n';
import { useStorage } from '@extension/shared';

export default function Takeover() {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';
  const [isClicked, setIsClicked] = useState(false);
  useEffect(() => {
    console.log('content ui loaded');
    if (isClicked) {
      console.log('Button was clicked');
    }
  }, [isClicked]);

  if (isClicked) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 top-0 w-full justify-center flex items-center gap-2 rounded bg-gray-800 px-2 py-1"
      style={{ zIndex: 9999 }}>
      <button className="text-white" onClick={() => setIsClicked(true)}>
        close
      </button>
    </div>
  );
}
