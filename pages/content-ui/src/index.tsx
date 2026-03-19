import { createRoot } from 'react-dom/client';
import App from '@src/App';
import Takeover from '@src/Takeover';
import LeetcodeExploreApp from '@src/matches/leetcode-explore/App';
// @ts-expect-error Because file doesn't exist before build
import tailwindcssOutput from '../dist/tailwind-output.css?inline';

const root = document.createElement('div');
root.id = 'sancorp-extension-content-view-root';

document.body.append(root);

const rootIntoShadow = document.createElement('div');
rootIntoShadow.id = 'shadow-root';

const shadowRoot = root.attachShadow({ mode: 'open' });

if (navigator.userAgent.includes('Firefox')) {
  /**
   * In the firefox environment, adoptedStyleSheets cannot be used due to the bug
   * @url https://bugzilla.mozilla.org/show_bug.cgi?id=1770592
   *
   * Injecting styles into the document, this may cause style conflicts with the host page
   */
  const styleElement = document.createElement('style');
  styleElement.innerHTML = tailwindcssOutput;
  shadowRoot.appendChild(styleElement);
} else {
  /** Inject styles into shadow dom */
  const globalStyleSheet = new CSSStyleSheet();
  globalStyleSheet.replaceSync(tailwindcssOutput);
  shadowRoot.adoptedStyleSheets = [globalStyleSheet];
}

const takeoverHostnames = ['youtube'];

function showTakeover(hostname: string) {
  return takeoverHostnames.some(takeoverHost => hostname.includes(takeoverHost));
}

function isLeetcodeExplore() {
  return window.location.hostname.includes('leetcode.com') && window.location.pathname.startsWith('/explore/');
}

shadowRoot.appendChild(rootIntoShadow);

const reactRoot = createRoot(rootIntoShadow);

function render() {
  if (isLeetcodeExplore()) {
    reactRoot.render(<LeetcodeExploreApp key={window.location.pathname} />);
  } else if (showTakeover(document.location.hostname)) {
    reactRoot.render(<Takeover />);
  } else {
    reactRoot.render(<App />);
  }
}

render();

// Re-render on SPA navigation (content scripts can't intercept page-world history calls)
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    render();
  }
}).observe(document, { childList: true, subtree: true });
