"use client";

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Settings, Eye, ShoppingCart, ToggleLeft, ToggleRight, Save, Info, Zap, MousePointer2, AlertTriangle, Check, CheckCircle2, TrendingUp } from 'lucide-react';
import CustomSelect from '@/components/dashboard/CustomSelect';

export default function WidgetsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const t = useTranslations('widgets');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  useEffect(() => {
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setLoading(false);
      });
  }, []);

  const saveSettings = async () => {
    setUpdating(true);
    try {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ widgets: user.widgets })
      });
      if (res.ok) {
        setToastMessage(t('settings.saveSuccess'));
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const updateWidget = (type: string, field: string, value: any) => {
    const newWidgets = { ...user.widgets };
    if (!newWidgets[type]) newWidgets[type] = {};
    newWidgets[type][field] = value;
    setUser({ ...user, widgets: newWidgets });
  };

  if (loading) return null;

  const widgets = user.widgets || {};

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 relative">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white dark:bg-slate-900/40 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 gap-6 shadow-sm">
        <div className="text-left space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('title')}</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm md:text-base font-medium">{t('subtitle')}</p>
        </div>
        <button 
          onClick={saveSettings}
          disabled={updating}
          className="w-full lg:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 text-sm uppercase tracking-wider"
        >
          {updating ? <Zap className="animate-spin" size={18} /> : <Save size={18} />}
          {updating ? tCommon('loading') : tCommon('save')}
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8 pb-10">
         {['viewers', 'purchases', 'upsell', 'exitIntent', 'retention', 'scarcity', 'welcome'].map((type) => (
           <WidgetConfigCard 
             key={type}
             type={type}
             icon={type === 'viewers' ? Eye : type === 'purchases' ? ShoppingCart : type === 'upsell' ? TrendingUp : type === 'scarcity' ? AlertTriangle : MousePointer2}
             title={t(`${type}.title`)}
             desc={t(`${type}.desc`)}
             enabled={widgets[type]?.enabled || false}
             onToggle={(val: boolean) => updateWidget(type, 'enabled', val)}
             settings={widgets[type] || {}}
             onUpdate={(field: string, val: any) => updateWidget(type, field, val)}
             isLocked={user.plan === 'free' && type !== 'viewers'}
             hasDiscount={type === 'exitIntent' || type === 'retention'}
           />
         ))}
      </div>
      </div>

      {/* Premium Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 right-10 z-[100] bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 p-2 pr-8 rounded-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] flex items-center gap-4 animate-in slide-in-from-bottom-10 fade-in zoom-in-95 duration-500">
           <div className="w-10 h-10 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Check size={20} className="text-white drop-shadow-md" strokeWidth={3} />
           </div>
           <div className="flex flex-col">
              <span className="font-bold tracking-tight text-sm text-slate-900 dark:text-white leading-none">{toastMessage}</span>
           </div>
        </div>
      )}
    </>
  );
}

function WidgetConfigCard({ type, icon: Icon, title, desc, enabled, onToggle, settings, onUpdate, isLocked, hasDiscount }: any) {
  const t = useTranslations('widgets');
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`p-6 md:p-8 rounded-[2rem] border transition-all duration-300 ${enabled ? 'border-blue-500/30 bg-white dark:bg-slate-900/40 shadow-xl' : 'border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/10 shadow-sm opacity-80'}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-left">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${enabled ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
            <Icon size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 uppercase">
              {title}
              {isLocked && <span className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 text-[10px] px-2 py-0.5 rounded-full border border-yellow-500/20 font-black italic">PRO</span>}
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400 italic">{desc}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400 transition-all shadow-sm border border-slate-200 dark:border-white/5"
          >
            <Settings size={16} /> {t('settings.title')}
          </button>
          
          <button 
            disabled={isLocked}
            onClick={() => onToggle(!enabled)}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95 ${enabled ? 'bg-green-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-gray-400'} ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {enabled ? t('settings.enabledLabel') : t('settings.disabledLabel')}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-10 pt-10 border-t border-slate-100 dark:border-white/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 text-left animate-in slide-in-from-top-4 duration-500">
          <div className="space-y-3">
             <label className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest pl-1">{t('settings.position')}</label>
             <CustomSelect 
               value={settings.position || 'bottom-left'} 
               onChange={(val) => onUpdate('position', val)}
               options={[
                 { value: 'inline', label: t('settings.inline') },
                 { value: 'top-left', label: t('settings.top-left') },
                 { value: 'top-right', label: t('settings.top-right') },
                 { value: 'bottom-left', label: t('settings.bottom-left') },
                 { value: 'bottom-right', label: t('settings.bottom-right') }
               ]}
             />
          </div>

          <div className="space-y-3">
             <label className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest pl-1">{t('settings.style')}</label>
             <CustomSelect 
               value={settings.style || 'light'} 
               onChange={(val) => onUpdate('style', val)}
               options={[
                 { value: 'light', label: t('settings.light') },
                 { value: 'dark', label: t('settings.dark') }
               ]}
             />
          </div>

           <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest pl-1">{t('settings.template')}</label>
              <textarea 
                value={settings.template || ''} 
                onChange={(e) => onUpdate('template', e.target.value)}
                rows={3}
                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-400 shadow-inner"
              />
           </div>

           {type === 'welcome' && (
             <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest pl-1">{t('settings.templateLong')}</label>
                <textarea 
                  value={settings.templateLong || ''} 
                  onChange={(e) => onUpdate('templateLong', e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-400 shadow-inner"
                />
             </div>
           )}

           {type === 'upsell' && (
             <div className="md:col-span-2 lg:col-span-3 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-3">
               <div className="flex items-center gap-2">
                 <label className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                   🔍 Product URL Pattern (Tùy chọn)
                 </label>
                 <div className="group relative cursor-help">
                   <Info size={14} className="text-slate-400" />
                   <div className="absolute bottom-full mb-3 left-0 w-72 p-4 bg-slate-900 text-white text-[10px] rounded-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10 italic shadow-2xl leading-relaxed">
                     Nhập từ khóa trong URL sản phẩm của bạn (ví dụ: "san-pham", "products", "shop").<br/><br/>
                     Hệ thống sẽ tự nhận diện trang sản phẩm nếu để trống.
                   </div>
                 </div>
               </div>
               <input
                 type="text"
                 value={settings.productPattern || ''}
                 onChange={(e) => onUpdate('productPattern', e.target.value)}
                 placeholder='Ví dụ: san-pham (để trống = tự nhận diện)'
                 className="w-full bg-white dark:bg-black/20 border border-blue-200 dark:border-blue-500/20 rounded-xl px-4 py-3.5 text-sm font-mono focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
               />
               <p className="text-[10px] text-slate-400 dark:text-gray-500 italic">
                 Nếu URL sản phẩm của bạn là <code>/san-pham/ten-sp/</code>, nhập <strong>san-pham</strong>. Hệ thống sẽ bỏ qua trang <code>/san-pham/</code> (listing) và chỉ theo dõi <code>/san-pham/ten-sp/</code> (sản phẩm).
               </p>
             </div>
           )}

          <div className="space-y-3">
             <label className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest pl-1">{t('settings.delay')}</label>
             <input 
               type="number"
               value={settings.delay || 3000} 
               onChange={(e) => onUpdate('delay', Number(e.target.value))}
               className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
             />
          </div>

          <div className="space-y-3">
             <label className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest pl-1">{t('settings.autoHide')}</label>
             <input 
               type="number"
               value={settings.autoHide || 5000} 
               onChange={(e) => onUpdate('autoHide', Number(e.target.value))}
               className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
             />
          </div>

          {hasDiscount && (
            <>
              <div className="space-y-3">
                 <label className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest pl-1">{t('settings.mode')}</label>
                 <CustomSelect 
                    value={settings.mode || 'code'} 
                    onChange={(val) => onUpdate('mode', val)}
                    options={[
                      { value: 'code', label: t('settings.modeCode') },
                      { value: 'redirect', label: t('settings.modeRedirect') },
                      { value: 'api', label: t('settings.modeApi') }
                    ]}
                 />
              </div>

              {settings.mode === 'code' && (
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest pl-1">{t('settings.code')}</label>
                  <input 
                    value={settings.code || ''} 
                    onChange={(e) => onUpdate('code', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-mono focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
                  />
                </div>
              )}
            </>
          )}

          <div className="md:col-span-2 lg:col-span-3 space-y-3 pt-6 border-t border-slate-100 dark:border-white/5">
             {type === 'scarcity' && (
               <div className="mb-8">
                 <div className="flex items-center gap-2 mb-2">
                    <label className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest pl-1">{t('settings.inventory')}</label>
                    <div className="group relative cursor-help">
                       <Info size={14} className="text-slate-400" />
                       <div className="absolute bottom-full mb-3 left-0 w-64 p-4 bg-slate-900 text-white text-[10px] rounded-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10 italic shadow-2xl leading-relaxed">
                          {t('settings.inventoryPlaceholder')}
                       </div>
                    </div>
                 </div>
                 <textarea 
                   value={Array.isArray(settings.inventory) ? settings.inventory.join('\n') : (settings.inventory || '')}
                   onChange={(e) => onUpdate('inventory', e.target.value.split('\n'))}
                   className="w-full h-32 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-xs font-mono focus:outline-none focus:border-blue-500/50 transition-all resize-none shadow-inner"
                   placeholder="iphone-15-pro : 5"
                 />
               </div>
             )}
             
             <div className="flex items-center gap-2 mb-2">
                <label className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest pl-1">{t('settings.targetUrls')}</label>
                <div className="group relative cursor-help">
                   <Info size={14} className="text-slate-400" />
                   <div className="absolute bottom-full mb-3 left-0 w-64 p-4 bg-slate-900 text-white text-[10px] rounded-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10 italic shadow-2xl leading-relaxed">
                      {t('settings.targetUrlsPlaceholder')}
                   </div>
                </div>
             </div>
             <textarea 
               value={Array.isArray(settings.targetUrls) ? settings.targetUrls.join('\n') : ''} 
               onChange={(e) => onUpdate('targetUrls', e.target.value.split('\n').filter((v: string) => v.trim() !== ''))}
               className="w-full h-32 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-xs font-mono focus:outline-none focus:border-blue-500/50 transition-all resize-none shadow-inner"
               placeholder={type === 'upsell' 
                 ? "⚠️ KHUYẾN NGHỊ: Để trống phần này cho Upsell.\nWidget sẽ tự động hiện trên tất cả trang sản phẩm dựa theo 'Product URL Pattern' ở trên." 
                 : "https://mysite.com/product-a"}
             />
          </div>
        </div>
      )}
    </div>
  );
}
