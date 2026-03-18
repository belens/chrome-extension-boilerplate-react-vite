import { useEffect, useState } from 'react';

export default function App() {
  const [problemUrl, setProblemUrl] = useState<string | null>(null);

  useEffect(() => {
    const match = window.location.pathname.match(/\/(\d+)\/?$/);
    if (!match) return;

    const itemId = match[1];

    fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{ item(id: "${itemId}") { question { titleSlug } } }`,
      }),
    })
      .then(res => res.json())
      .then(data => {
        const slug = data?.data?.item?.question?.titleSlug;
        if (slug) {
          setProblemUrl(`https://leetcode.com/problems/${slug}/`);
        }
      })
      .catch(() => {});
  }, []);

  if (!problemUrl) return null;

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      <a
        href={problemUrl}
        target="_blank"
        rel="noreferrer"
        style={{
          background: '#ffa116',
          color: '#fff',
          padding: '8px 16px',
          borderRadius: '6px',
          fontWeight: 'bold',
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>
        Open Problem ↗
      </a>
    </div>
  );
}
