"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function WidgetPage() {
  const searchParams = useSearchParams();
  const [count, setCount] = useState(3);
  const [settings, setSettings] = useState<any>(null);
  const key = searchParams.get('key');
  const type = searchParams.get('type') || 'viewers';
  const page = searchParams.get('page') || '/';

  useEffect(() => {
    if (!key) return;

    // Fetch settings
    fetch(`/api/boot?key=${key}&widget=${type}`)
      .then(res => res.json())
      .then(data => setSettings(data.settings));

    if (type === 'viewers') {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${protocol}//${window.location.host}/api/ws?key=${key}&page=${page}`);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'update') setCount(data.count);
      };

      return () => ws.close();
    }
  }, [key, type, page]);

  if (!key || !settings) return null;

  const isDark = settings.style === 'dark';

  return (
    <div className={`
      w-full h-full flex items-center gap-3 p-4 rounded-2xl border font-sans font-bold text-sm overflow-hidden
      ${isDark ? 'bg-slate-900/90 text-white border-white/10' : 'bg-white/90 text-slate-900 border-slate-200'}
    `} style={{ backdropFilter: 'blur(10px)' }}>
      {type === 'viewers' ? (
        <>
          <span className="text-xl">🔥</span>
          <span>{count} people are viewing</span>
        </>
      ) : (
        <>
          <span className="text-xl">🛒</span>
          <div>
            <div className="opacity-60 text-[10px]">Recent Purchase</div>
            <div className="leading-tight">Elite Pro Pack</div>
          </div>
        </>
      )}
    </div>
  );
}
