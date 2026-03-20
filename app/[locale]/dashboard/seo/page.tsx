"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Zap, CheckCircle2, AlertCircle, Sparkles, XCircle, Check } from 'lucide-react';

export default function SEOPage() {
  const t = useTranslations('seo');
  const tCommon = useTranslations('common');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [seoEnabled, setSeoEnabled] = useState(false);
  const [seoKeywords, setSeoKeywords] = useState('');
  const [toastMessage, setToastMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setSeoEnabled(data.user.seoEnabled);
        setSeoKeywords(data.user.seoKeywords || '');
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seoEnabled, seoKeywords })
      });
      if (res.ok) {
        setToastMessage({ type: 'success', text: t('saveSuccess') });
      } else {
        setToastMessage({ type: 'error', text: t('saveError') });
      }
      setTimeout(() => setToastMessage(null), 3000);
    } catch (e) {
      setToastMessage({ type: 'error', text: t('saveError') });
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 relative">
        <header className="px-1 text-left space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
           {t('title')} <Zap className="text-yellow-500 fill-yellow-500 animate-pulse" size={24} />
        </h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm md:text-base font-medium">{t('subtitle')}</p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 space-y-8 text-left relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between mb-2">
                 <div className="space-y-1">
                    <h3 className="text-slate-900 dark:text-white font-bold text-xl">{t('enabledLabel')}</h3>
                    <p className="text-slate-500 dark:text-gray-500 text-sm font-medium italic">Tự động tối ưu hóa hiển thị dựa trên bộ máy tìm kiếm của Google</p>
                 </div>
                 <button 
                  onClick={() => setSeoEnabled(!seoEnabled)}
                  className={`relative w-16 h-8 rounded-full transition-all duration-300 ${seoEnabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-white/10'}`}
                 >
                   <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${seoEnabled ? 'translate-x-8' : 'translate-x-0'}`} />
                 </button>
              </div>

              <div className="bg-slate-50 dark:bg-black/20 p-6 rounded-2xl border border-slate-100 dark:border-white/5 space-y-4 shadow-inner">
                 <label className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest pl-1 font-bold italic">
                    {t('keywordsLabel')}
                 </label>
                 <textarea 
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    placeholder={t('keywordsPlaceholder')}
                    className="w-full h-32 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all resize-none shadow-sm"
                 />
              </div>

              <button 
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50 active:scale-95"
              >
                {saving ? tCommon('loading') : tCommon('save')}
              </button>
            </div>

            <div className="p-8 rounded-[2rem] border border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-600/5 text-left border-dashed shadow-sm">
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 text-white">
                     <Sparkles size={20} />
                  </div>
                  <div className="space-y-1">
                     <h4 className="text-slate-900 dark:text-white font-bold uppercase text-sm tracking-tight">{t('tipTitle')}</h4>
                     <p className="text-slate-600 dark:text-gray-400 text-xs leading-relaxed italic font-medium">{t('tipDesc')}</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 space-y-8 text-left shadow-sm">
               <h4 className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em] pl-1 font-bold">QUYỀN LỢI ĐẶC BIỆT</h4>
               <div className="space-y-5">
                  <BenefitItem text="Tăng tỷ lệ Click-Through (CTR)" />
                  <BenefitItem text="Giảm tỷ lệ thoát trang (Bounce Rate)" />
                  <BenefitItem text="Tự động hóa Schema JSON-LD" />
                  <BenefitItem text="Nổi bật trên trang tìm kiếm" />
               </div>
            </div>
         </div>
      </section>
      </div>

      {/* Premium Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 right-10 z-[100] bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 p-2 pr-8 rounded-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] flex items-center gap-4 animate-in slide-in-from-bottom-10 fade-in zoom-in-95 duration-500">
           {toastMessage.type === 'success' ? (
             <div className="w-10 h-10 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <Check size={20} className="text-white drop-shadow-md" strokeWidth={3} />
             </div>
           ) : (
             <div className="w-10 h-10 bg-gradient-to-tr from-red-500 to-rose-400 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                <XCircle size={20} className="text-white drop-shadow-md" strokeWidth={3} />
             </div>
           )}
           <div className="flex flex-col">
              <span className="font-bold tracking-tight text-sm text-slate-900 dark:text-white leading-none">{toastMessage.text}</span>
           </div>
        </div>
      )}
    </>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4">
       <div className="bg-green-500/10 p-1.5 rounded-lg">
          <CheckCircle2 size={16} className="text-green-600 dark:text-green-500" />
       </div>
       <span className="text-xs text-slate-600 dark:text-gray-300 font-bold italic">{text}</span>
    </div>
  );
}
