"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, Terminal, Globe, Layout, CheckCircle2, Zap, X } from 'lucide-react';

export default function EmbedPage() {
  const [user, setUser] = useState<any>(null);
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

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const phpSnippet = `add_action('woocommerce_thankyou', 'liveproof_tracker');

function liveproof_tracker($order_id) {
    if (!$order_id) return;
    $order = wc_get_order($order_id);
    $items = $order->get_items();
    $product_name = count($items) > 0 ? current($items)->get_name() : '';
    
    wp_remote_post('${baseUrl}/api/purchases', [
        'body' => json_encode([
            'apiKey' => '${user?.apiKey || 'YOUR_API_KEY'}',
            'product' => $product_name,
            'location' => $order->get_billing_city(),
            'customerName' => $order->get_billing_first_name(),
            'customerEmail' => $order->get_billing_email()
        ]),
        'headers' => ['Content-Type' => 'application/json']
    ]);
}`;

  const [selectedGuide, setSelectedGuide] = useState<any>(null);
  const [apiTab, setApiTab] = useState<'custom' | 'woocommerce'>('custom');

  const guides: any = {
    'WordPress': { id: 'wordpress', steps: [0, 1, 2, 3] },
    'Shopify': { id: 'shopify', steps: [0, 1, 2, 3] },
    'Webflow': { id: 'html', steps: [0, 1, 2] },
    'Custom': { id: 'html', steps: [0, 1, 2] }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Guide Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in zoom-in-95 duration-200">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative">
              <button 
                onClick={() => setSelectedGuide(null)}
                className="absolute top-6 right-6 p-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl text-slate-400 dark:text-gray-400 transition-all z-10"
              >
                <X size={20} />
              </button>
              <div className="p-10 md:p-14 space-y-8">
                 <div className="space-y-2">
                    <p className="text-blue-600 dark:text-blue-500 text-[10px] font-bold uppercase tracking-widest">{tCommon('getStarted')}</p>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-none uppercase">{t(`guides.${selectedGuide.id}.title`)}</h3>
                 </div>
                 <div className="space-y-5">
                    {selectedGuide.steps.map((idx: number) => (
                      <div key={idx} className="flex gap-4 p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 items-start group shadow-sm transition-all duration-300">
                         <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-[12px] font-bold shrink-0 text-white shadow-lg shadow-blue-600/20">{idx + 1}</div>
                         <p className="text-sm text-slate-600 dark:text-gray-300 font-medium italic leading-relaxed">{t(`guides.${selectedGuide.id}.steps.${idx}`)}</p>
                      </div>
                    ))}
                 </div>
                 <button 
                  onClick={() => setSelectedGuide(null)}
                  className="w-full py-4 bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-black font-bold uppercase text-[11px] tracking-widest rounded-xl transition-all shadow-xl"
                 >
                   {tCommon('save')}
                 </button>
              </div>
           </div>
        </div>
      )}

      <header className="text-left space-y-2 px-1">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">{t('title')}</h1>
        <p className="text-slate-500 dark:text-gray-500 text-sm md:text-lg font-medium italic max-w-2xl leading-relaxed">{t('subtitle')}</p>
      </header>

      {/* Main Section: Script Copy */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
         <div className="xl:col-span-8 space-y-6">
            <div className="rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/60 overflow-hidden h-full flex flex-col shadow-sm">
               <div className="px-8 py-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
                  <div className="flex items-center gap-4">
                     <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                     </div>
                     <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest bg-white dark:bg-white/5 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-white/5 italic">live-proof.js</span>
                  </div>
               </div>
               <div className="p-10 md:p-14 flex-1 flex flex-col justify-center relative group min-h-[250px]">
                  <pre className="text-sm md:text-base font-mono text-blue-600 dark:text-blue-400 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                     {generateCode()}
                  </pre>
                  <div className="mt-10 flex flex-wrap gap-4 items-center">
                     <button 
                        onClick={() => copy(generateCode())}
                        className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-xs font-bold transition-all shadow-xl shadow-blue-600/30 uppercase tracking-widest italic active:scale-95"
                     >
                        {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                        {copied ? tCommon('copied') : tCommon('copy')}
                     </button>
                  </div>
               </div>
            </div>
         </div>

         <div className="xl:col-span-4 flex flex-col gap-6">
            <div className="p-10 rounded-[2.5rem] bg-blue-600/5 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/20 flex-1 flex flex-col justify-between relative overflow-hidden group shadow-sm">
               <div className="absolute -top-10 -right-10 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                  <Zap size={200} className="text-blue-600 dark:text-blue-400" />
               </div>
               <div className="space-y-6 relative text-left">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/40">
                     <Zap size={24} className="text-white fill-white" />
                  </div>
                  <div className="space-y-3">
                     <h3 className="text-xl font-bold uppercase italic tracking-tight text-slate-900 dark:text-white uppercase">{t('masterScript')}</h3>
                     <p className="text-sm text-slate-500 dark:text-blue-100/60 leading-relaxed font-medium italic">
                        {t('instruction')}
                     </p>
                  </div>
               </div>
               <div className="pt-8 border-t border-slate-200 dark:border-blue-500/20 mt-8">
                  <div className="flex -space-x-3">
                     {[1,2,3,4].map(i => (
                       <div key={i} className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400 shadow-xl">W</div>
                     ))}
                     <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-xl">+99</div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Integration Platforms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="p-8 md:p-12 rounded-[2.5rem] bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 space-y-10 shadow-sm">
               <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 text-left">
                  <div className="space-y-1">
                     <h4 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">{t('platforms')}</h4>
                     <p className="text-slate-500 dark:text-gray-500 text-xs italic font-medium">Tích hợp nhanh chóng vào các nền tảng phổ biến.</p>
                  </div>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PlatformCard name="WordPress" icon="W" label={t('guide', { name: 'WordPress' })} onClick={() => setSelectedGuide(guides['WordPress'])} />
                  <PlatformCard name="Shopify" icon="S" label={t('guide', { name: 'Shopify' })} onClick={() => setSelectedGuide(guides['Shopify'])} />
                  <PlatformCard name="Webflow" icon="W" label={t('guide', { name: 'Webflow' })} onClick={() => setSelectedGuide(guides['Webflow'])} />
                  <PlatformCard name="Custom Site" icon="C" label={t('guide', { name: 'Custom Site' })} onClick={() => setSelectedGuide(guides['Custom'])} />
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="p-8 md:p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-8 h-full text-left shadow-sm">
               <h4 className="text-sm font-bold uppercase text-slate-500 dark:text-gray-500 tracking-widest italic">{t('howItWorks')}</h4>
               <ul className="space-y-6">
                  {[0, 1, 2].map((i) => (
                     <li key={i} className="flex gap-4 text-sm font-semibold text-slate-600 dark:text-gray-400 italic leading-relaxed">
                        <div className="w-7 h-7 bg-green-500/10 rounded-lg flex items-center justify-center shrink-0">
                          <CheckCircle2 size={16} className="text-green-600 dark:text-green-500" strokeWidth={3} />
                        </div>
                        {t(`benefits.${i}`)}
                     </li>
                  ))}
               </ul>
            </div>
         </div>
      </div>

      {/* API Order Tracking Section */}
      <section className="space-y-8 pt-12 border-t border-slate-100 dark:border-white/5">
         <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 text-left px-1">
            <div className="space-y-3">
               <div className="space-y-1">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">{t('events.title')}</h2>
                  <p className="text-slate-500 dark:text-gray-500 text-sm md:text-lg italic font-medium">{t('events.subtitle')}</p>
               </div>
               <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 px-4 py-2.5 rounded-xl border border-blue-100 dark:border-blue-500/20 text-blue-700 dark:text-blue-300 shadow-sm leading-none">
                  <Zap size={16} className="text-yellow-500 fill-yellow-500 shrink-0" />
                  <span className="text-xs md:text-sm font-bold tracking-tight italic">Dữ liệu này dành riêng cho Tiện ích: <strong className="font-black uppercase tracking-widest">Khách Vừa Mua (Purchases)</strong> & <strong className="font-black uppercase tracking-widest">Lòng Trung Thành (Loyalty)</strong></span>
               </div>
            </div>
            
            <div className="flex bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-inner shrink-0 w-full xl:w-auto h-fit">
               <button 
                  onClick={() => setApiTab('custom')}
                  className={`flex-1 xl:flex-none px-6 py-3.5 rounded-xl text-xs md:text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${apiTab === 'custom' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-white/5' : 'text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-white'}`}
               >
                  <Terminal size={18} /> API Tùy Chỉnh
               </button>
               <button 
                  onClick={() => setApiTab('woocommerce')}
                  className={`flex-1 xl:flex-none px-6 py-3.5 rounded-xl text-xs md:text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${apiTab === 'woocommerce' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' : 'text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-white'}`}
               >
                  <span className="font-serif italic font-black text-xl leading-none -mt-1">W</span> WooCommerce
               </button>
            </div>
         </div>

         {apiTab === 'custom' ? (
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="p-8 md:p-12 rounded-[2.5rem] bg-indigo-600/[0.03] dark:bg-indigo-600/5 border border-indigo-100 dark:border-indigo-500/10 space-y-10 flex flex-col justify-between text-left shadow-sm">
                 <div className="space-y-6">
                    <div className="p-6 rounded-[1.5rem] bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-100 dark:border-indigo-500/20 italic text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed font-semibold shadow-sm">
                       {t('events.info')}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-5 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/5 shadow-sm">
                          <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-gray-600 mb-2 tracking-widest italic">Method</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-white underline decoration-indigo-500 decoration-2 underline-offset-4 uppercase">HTTP POST</p>
                       </div>
                       <div className="p-5 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/5 shadow-sm">
                          <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-gray-600 mb-2 tracking-widest italic">Auth</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-white underline decoration-indigo-500 decoration-2 underline-offset-4 uppercase">API Key</p>
                       </div>
                    </div>
                 </div>
                 <div className="p-6 md:p-8 bg-slate-50 dark:bg-black/60 rounded-[2rem] border border-slate-200 dark:border-indigo-500/30 font-mono text-center shadow-inner overflow-hidden flex flex-col items-center justify-center gap-4">
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-300 px-3 py-1 rounded-lg uppercase tracking-widest font-bold font-sans">Endpoint URL</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest text-xs lg:text-sm break-all">{baseUrl}/api/purchases</span>
                 </div>
              </div>

              <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black/60 overflow-hidden text-left shadow-sm flex flex-col">
                 <div className="px-8 py-5 border-b border-slate-100 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest italic py-1.5 px-3 bg-white dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5 shadow-sm">payload.json</span>
                 </div>
                 <div className="p-10 md:p-14 flex-1 flex items-center">
                    <pre className="text-xs md:text-sm font-mono text-blue-600 dark:text-blue-400 leading-relaxed scrollbar-hide">
{`{
  "apiKey": "${user?.apiKey || 'pk_...'}",
  "product": "iPhone 15 Pro",
  "location": "Hà Nội, VN",
  "customerName": "Thắng Nguyễn"
}`}
                    </pre>
                 </div>
              </div>

              {/* Loyalty Validation API - NEW SECTION */}
              <div className="xl:col-span-2 p-8 md:p-12 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 space-y-8 text-left shadow-sm">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
                       <Zap size={24} className="text-white fill-white" />
                    </div>
                    <div className="space-y-1">
                       <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">Backend Verification (Security)</h3>
                       <p className="text-slate-500 dark:text-gray-500 text-sm italic font-medium">Sử dụng API này trên Server của bạn (WooCommerce/Shopify) để xác minh xem khách hàng có thực sự đủ điều kiện dùng mã giảm giá hay không.</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-12 p-6 bg-white dark:bg-black/40 rounded-2xl border border-slate-200 dark:border-white/5 space-y-4">
                       <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-black rounded-lg">GET</span>
                          <code className="text-xs md:text-sm font-bold text-slate-700 dark:text-amber-400 break-all">{baseUrl}/api/loyalty/check?apiKey={user?.apiKey || '...'}&email=KHÁCH@GMAIL.COM&coupon=MÃ-GIẢM-GIÁ</code>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
         ) : (
           <div className="rounded-[2.5rem] border border-slate-200 dark:border-purple-500/20 bg-slate-50 dark:bg-[#0d1117] overflow-hidden text-left shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="px-8 py-5 border-b border-slate-100 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                       <span className="text-purple-600 dark:text-purple-400 text-xs font-bold uppercase italic border-b-2 border-purple-500">PHP</span>
                    </div>
                    <div className="space-y-0.5">
                       <span className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight block">Mã nhúng tự động</span>
                       <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest italic font-mono block">Dán vào dòng cuối cùng của functions.php</span>
                    </div>
                 </div>
                 <button 
                    onClick={() => copy(phpSnippet)}
                    className="px-6 py-3 bg-purple-100 hover:bg-purple-200 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-xl text-xs md:text-sm font-bold uppercase tracking-widest italic transition-all flex items-center justify-center gap-2 shadow-sm shrink-0"
                 >
                    <Copy size={16} /> Copy Mã PHP
                 </button>
              </div>
              <div className="p-8 md:p-10 overflow-x-auto">
                 <pre className="text-xs md:text-sm font-mono text-slate-700 dark:text-blue-300 leading-relaxed scrollbar-hide">
                    {phpSnippet}
                 </pre>
              </div>
           </div>
         )}
      </section>
    </div>
  );
}

function PlatformCard({ icon, label, onClick, name }: any) {
  return (
    <button 
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className="flex items-center gap-6 p-6 md:p-8 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 hover:border-blue-500/30 rounded-[2rem] transition-all group active:scale-95 text-left shadow-sm"
    >
       <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-black/60 flex items-center justify-center text-lg font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 transition-all shadow-inner">
          {icon}
       </div>
       <div className="min-w-0 flex-1 space-y-1">
          <p className="text-slate-900 dark:text-white font-bold text-lg uppercase tracking-tight truncate">{name}</p>
          <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-300 uppercase italic tracking-widest transition-colors truncate">{label}</p>
       </div>
    </button>
  );
}
