"use client";

import { useEffect, useState } from 'react';

interface WidgetPreviewProps {
  apiKey: string | string[] | undefined;
}

export default function WidgetPreview({ apiKey }: WidgetPreviewProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!apiKey) return;

    // Load the live.js script dynamically for preview
    const scriptId = 'lp-preview-script';
    
    // Remove if already exists
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `${window.location.origin}/live.js`;
    script.async = true;
    script.setAttribute('data-key', apiKey as string);
    
    script.onload = () => {
       setIsLoaded(true);
    };

    document.body.appendChild(script);

    return () => {
      script.remove();
      // Also clean up any containers live.js might have created
      const containers = document.querySelectorAll('[id^="tlp-"]');
      containers.forEach(c => c.remove());
    };
  }, [apiKey]);

  if (!apiKey) {
    return (
      <div className="p-10 text-center glass-card rounded-3xl border border-white/10">
        <p className="text-gray-400 font-bold">⚠️ Vui lòng cung cấp mã API để xem trước (Error: Missing Key)</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-1000">
      <div className="bg-blue-600/10 border border-blue-500/20 px-6 py-3 rounded-full text-blue-400 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/5">
         --- Chế độ xem trước Widget ---
      </div>
      
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-4xl font-black tracking-tight text-white capitalize">Web của bạn sẽ hiện như thế này!</h2>
        <p className="text-gray-400 text-sm leading-relaxed">Các Widget bạn đã bật trong Dashboard sẽ bắt đầu tự động hiện ra ở đây sau 1 - 2 giây.</p>
      </div>

      {!isLoaded && (
         <div className="flex items-center gap-3 text-gray-500 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-[10px] font-black uppercase tracking-tighter">Đang kết nối API...</span>
         </div>
      )}
    </div>
  );
}
