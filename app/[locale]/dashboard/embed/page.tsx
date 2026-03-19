"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useTranslations } from 'next-intl';
import { Copy, Terminal, Globe, Layout, CheckCircle2, Zap } from 'lucide-react';
import CustomSelect from '@/components/dashboard/CustomSelect';

export default function EmbedPage() {
  const [user, setUser] = useState<any>(null);
  const [embedMethod, setEmbedMethod] = useState('script');
  const [eventMethod, setEventMethod] = useState('js');
  const [widget, setWidget] = useState('viewers');
  const [copied, setCopied] = useState(false);
  const t = useTranslations('embed');
  const tCommon = useTranslations('common');

  useEffect(() => {
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  
  const generateCode = () => {
    return `<script 
  src="${baseUrl}/live.js" 
  data-key="${user?.apiKey}"
></script>`;
  };

  const generateEventCode = (lang: string) => {
    if (lang === 'js') {
      return `fetch('${baseUrl}/api/purchases', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apiKey: '${user?.apiKey}',
    product: 'Product Name',
    location: 'Customer Location',
    customerName: 'John Doe'
  })
});`;
    }
    return `curl -X POST ${baseUrl}/api/purchases \\
  -H "Content-Type: application/json" \\
  -d '{"apiKey": "${user?.apiKey}", "product": "iPhone 15", "location": "New York"}'`;
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-gray-400">{t('subtitle')}</p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <div className="lg:col-span-1 space-y-8">
              <div className="p-6 rounded-3xl bg-blue-600/10 border border-blue-500/20 space-y-4">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Zap size={24} className="text-white fill-white" />
                 </div>
                 <h3 className="text-lg font-black uppercase tracking-tight">Master Script</h3>
                 <p className="text-xs text-blue-200/60 leading-relaxed">
                   {t('instruction')}
                 </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 space-y-4">
                 <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">How it works</h4>
                 <ul className="space-y-3">
                    {['One script for all widgets', 'Config everything from dashboard', 'No code changes needed after install'].map((text, i) => (
                       <li key={i} className="flex gap-3 text-[10px] font-bold text-gray-400">
                          <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                          {text}
                       </li>
                    ))}
                 </ul>
              </div>
           </div>

           <div className="lg:col-span-2 space-y-6">
              <div className="glass-card rounded-3xl border border-white/5 bg-black/40 relative focus-within:z-50">
                 <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex gap-1.5">
                       <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                       <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                       <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded">index.html</span>
                 </div>
                 <div className="p-8 relative group">
                    <pre className="text-xs font-mono text-blue-300 leading-relaxed overflow-x-auto">
                       {generateCode()}
                    </pre>
                    <button 
                       onClick={() => copy(generateCode())}
                       className="absolute top-6 right-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
                    >
                       {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                       {copied ? tCommon('copied') : tCommon('copy')}
                    </button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 space-y-4">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                       <Layout size={16} className="text-blue-400" />
                       Platform Integration
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                       <PlatformLink name="WordPress" icon="W" />
                       <PlatformLink name="Shopify" icon="S" />
                       <PlatformLink name="Webflow" icon="W" />
                       <PlatformLink name="Custom" icon="C" />
                    </div>
                 </div>

                 <div className="p-6 rounded-2xl bg-blue-600/5 border border-blue-500/20 space-y-4">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                       <Zap size={16} className="text-blue-400" />
                       WP Shortcode
                    </h4>
                    <div className="p-4 bg-black/40 rounded-xl font-mono text-[10px] text-blue-300">
                       [tlp_master]
                    </div>
                    <p className="text-[10px] text-gray-500 leading-tight">Install our TP LiveProof plugin or paste our script manually.</p>
                 </div>
              </div>
           </div>
        </section>
        {/* Event Tracking Integration Section */}
        <section className="space-y-6 pt-10 border-t border-white/5">
           <div>
              <h2 className="text-2xl font-bold">{t('events.title')}</h2>
              <p className="text-gray-400 text-sm mt-1">{t('events.subtitle')}</p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-4">
                 <div className="flex gap-2">
                    {['javascript', 'curl'].map(m => (
                       <button 
                         key={m}
                         onClick={() => setEventMethod(m === 'javascript' ? 'js' : 'curl')}
                         className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${((eventMethod === 'js' && m === 'javascript') || (eventMethod === 'curl' && m === 'curl')) ? 'bg-blue-600' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                       >
                          {m}
                       </button>
                    ))}
                 </div>
                 <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                    <p className="text-xs text-blue-200/60 leading-relaxed font-medium">
                       Gửi dữ liệu đơn hàng ngay khi khách thanh toán xong. Đơn hàng sẽ được hiển thị trên widget "Recent Purchases" của bạn.
                    </p>
                 </div>
              </div>

              <div className="glass-card rounded-3xl border border-white/5 bg-black/40 relative focus-within:z-50">
                 <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                       {eventMethod === 'curl' ? 'terminal' : 'backend-snippet.js'}
                    </span>
                 </div>
                 <div className="p-8 relative group">
                    <pre className="text-[11px] font-mono text-blue-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                       {generateEventCode(eventMethod)}
                    </pre>
                    <button 
                       onClick={() => copy(generateEventCode(eventMethod))}
                       className="absolute top-6 right-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
                    >
                       {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                       {copied ? tCommon('copied') : tCommon('copy')}
                    </button>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function MethodToggle({ icon: Icon, id, active, onClick, label, desc }: any) {
  const isActive = active === id;
  return (
    <button 
       onClick={() => onClick(id)}
       className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${isActive ? 'bg-blue-600/10 border-blue-500/40' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
    >
       <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-500'}`}>
          <Icon size={18} />
       </div>
       <div>
          <p className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>{label}</p>
          <p className="text-[10px] text-gray-500 font-medium">{desc}</p>
       </div>
    </button>
  );
}

function PlatformLink({ name, icon }: any) {
  return (
    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all group">
       <span className="w-6 h-6 rounded bg-black/40 flex items-center justify-center text-[10px] font-black group-hover:text-blue-400">{icon}</span>
       <span className="text-xs font-bold text-gray-400 group-hover:text-white">{name} Guide</span>
    </a>
  );
}
