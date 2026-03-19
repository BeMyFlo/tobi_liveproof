"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useTranslations } from 'next-intl';
import { Settings, Eye, ShoppingCart, ToggleLeft, ToggleRight, Save, Info, Zap, MousePointer2, AlertTriangle } from 'lucide-react';
import CustomSelect from '@/components/dashboard/CustomSelect';

export default function WidgetsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const t = useTranslations('widgets');
  const tCommon = useTranslations('common');

  useEffect(() => {
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => {
        const userData = data.user;
        // Merge with defaults to ensure all widget types exist in state
        const defaultWidgets = {
          viewers: { enabled: true, position: 'bottom-right', style: 'dark', template: '🔥 {count} people are viewing', delay: 3000, hideAfter: 10000, mode: 'floating', targetSelector: '', targetUrls: '' },
          purchases: { enabled: false, position: 'bottom-right', style: 'dark', template: '🛒 Someone just purchased {product} from {location}', delay: 3000, hideAfter: 10000, mode: 'floating', targetSelector: '', targetUrls: '' },
          exitIntent: { enabled: false, position: 'bottom-right', style: 'dark', template: 'Don\'t leave! Here is a gift: {code}', delay: 3000, hideAfter: 10000, mode: 'floating', discountEnabled: true, discountMode: 'code', discountCode: 'WELCOME25', targetSelector: '', targetUrls: '' },
          retention: { enabled: false, position: 'bottom-right', style: 'dark', template: 'Thanks for staying! Use this code to checkout: {code}', delay: 30000, hideAfter: 10000, mode: 'floating', discountEnabled: true, discountMode: 'code', discountCode: 'STAY10', targetSelector: '', targetUrls: '' },
          scarcity: { enabled: false, position: 'bottom-right', style: 'dark', template: '🔥 Chỉ còn {count} chiếc {product} trong kho!', delay: 5000, hideAfter: 8000, mode: 'floating', targetSelector: '', targetUrls: '', inventory: '' },
          loyalty: { enabled: false, position: 'bottom-right', style: 'dark', template: 'Chào mừng bạn quay lại! Rất vui được gặp lại bạn.', templateLong: 'Chào mừng bạn quay lại! Đã lâu không gặp.', delay: 2000, hideAfter: 8000, mode: 'floating', targetSelector: '', targetUrls: '' }
        };
        
        const widgets = userData.widgets || {};
        userData.widgets = {
          viewers: { ...defaultWidgets.viewers, ...widgets.viewers },
          purchases: { ...defaultWidgets.purchases, ...widgets.purchases },
          exitIntent: { ...defaultWidgets.exitIntent, ...widgets.exitIntent },
          retention: { ...defaultWidgets.retention, ...widgets.retention },
          scarcity: { ...defaultWidgets.scarcity, ...widgets.scarcity },
          loyalty: { ...defaultWidgets.loyalty, ...widgets.loyalty }
        };
        
        setUser(userData);
        setLoading(false);
      });
  }, []);

  const saveSettings = async () => {
    setUpdating(true);
    try {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ widgets: user.widgets }),
      });
      const data = await res.json();
      console.log('Server save response:', JSON.stringify(data, null, 2));
      alert('Settings saved successfully!');
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save settings');
    } finally {
      setUpdating(false);
    }
  };

  const updateWidget = (type: string, field: string, val: any) => {
    setUser((prev: any) => {
      const currentWidgets = prev.widgets || {};
      const currentWidget = currentWidgets[type] || {};
      return {
        ...prev,
        widgets: {
          ...currentWidgets,
          [type]: { ...currentWidget, [field]: val }
        }
      };
    });
  };

  if (loading || !user) return null;

  const widgets = user.widgets || {};

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <header className="flex justify-between items-center bg-slate-900/40 p-8 rounded-3xl border border-white/5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
            <p className="text-gray-400 mt-1">{t('subtitle')}</p>
          </div>
          <button 
            onClick={saveSettings}
            disabled={updating}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            <Save size={20} />
            {updating ? tCommon('loading') : tCommon('save')}
          </button>
        </header>

        <div className="grid grid-cols-1 gap-12">
           <WidgetConfigCard 
             icon={Eye}
             title={t('viewers.title')}
             desc={t('viewers.desc')}
             enabled={widgets.viewers?.enabled || false}
             onToggle={(val: boolean) => updateWidget('viewers', 'enabled', val)}
             settings={widgets.viewers || {}}
             onUpdate={(field: string, val: any) => updateWidget('viewers', field, val)}
           />

           <WidgetConfigCard 
             icon={ShoppingCart}
             title={t('purchases.title')}
             desc={t('purchases.desc')}
             enabled={widgets.purchases?.enabled || false}
             onToggle={(val: boolean) => updateWidget('purchases', 'enabled', val)}
             settings={widgets.purchases || {}}
             onUpdate={(field: string, val: any) => updateWidget('purchases', field, val)}
             isLocked={user.plan === 'free'}
           />

           <WidgetConfigCard 
             icon={MousePointer2}
             title={t('exitIntent.title')}
             desc={t('exitIntent.desc')}
             enabled={widgets.exitIntent?.enabled || false}
             onToggle={(val: boolean) => updateWidget('exitIntent', 'enabled', val)}
             settings={widgets.exitIntent || {}}
             onUpdate={(field: string, val: any) => updateWidget('exitIntent', field, val)}
             hasDiscount
             isLocked={user.plan === 'free'}
           />
 
           <WidgetConfigCard 
             icon={Zap}
             title={t('retention.title')}
             desc={t('retention.desc')}
             enabled={widgets.retention?.enabled || false}
             onToggle={(val: boolean) => updateWidget('retention', 'enabled', val)}
             settings={widgets.retention || {}}
             onUpdate={(field: string, val: any) => updateWidget('retention', field, val)}
             hasDiscount
              isLocked={user.plan === 'free'}
           />

           <WidgetConfigCard 
             icon={AlertTriangle}
             title={t('scarcity.title')}
             desc={t('scarcity.desc')}
             enabled={widgets.scarcity?.enabled || false}
             onToggle={(val: boolean) => updateWidget('scarcity', 'enabled', val)}
             settings={widgets.scarcity || {}}
             onUpdate={(field: string, val: any) => updateWidget('scarcity', field, val)}
             isLocked={user.plan === 'free'}
           />

            <WidgetConfigCard 
              icon={Zap}
              title={t('loyalty.title')}
              desc={t('loyalty.desc')}
              enabled={widgets.loyalty?.enabled || false}
              onToggle={(val: boolean) => updateWidget('loyalty', 'enabled', val)}
              settings={widgets.loyalty || {}}
              onUpdate={(field: string, val: any) => updateWidget('loyalty', field, val)}
              isLocked={user.plan === 'free'}
            />
        </div>
      </div>
    </DashboardLayout>
  );
}

function WidgetConfigCard({ icon: Icon, title, desc, enabled, onToggle, settings, onUpdate, isLocked, hasDiscount }: any) {
  const t = useTranslations('widgets');
  const ts = useTranslations('widgets.settings');
  const tCommon = useTranslations('common');
  
  const isPopup = title === t('exitIntent.title') || title === t('retention.title');
  const isScarcity = title === t('scarcity.title');
  const isSpecial = isPopup || isScarcity;

  return (
    <div className={`glass-card rounded-[2rem] border border-white/10 bg-white/5 transition-all relative focus-within:z-40 ${!enabled && 'opacity-60 grayscale-[0.5]'}`}>
       <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-6">
             <div className="p-5 bg-blue-600/10 rounded-2xl text-blue-400 border border-blue-500/20">
                <Icon size={32} />
             </div>
             <div>
                <h3 className="text-2xl font-black flex items-center gap-3">
                   {title}
                    {isLocked && <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-[10px] px-2.5 py-1 rounded-full font-black uppercase shadow-lg shadow-yellow-500/20">{tCommon('upgrade')}</span>}
                </h3>
                <p className="text-gray-400 text-sm max-w-md mt-1">{desc}</p>
             </div>
          </div>
          <button 
            disabled={isLocked}
            onClick={() => onToggle(!enabled)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg ${enabled ? 'bg-green-500 text-black hover:bg-green-400 shadow-green-500/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
             {enabled ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
             {enabled ? tCommon('enabled') : tCommon('disabled')}
          </button>
       </div>

       {enabled && !isLocked && (
          <div className="p-8 space-y-12 animate-in fade-in slide-in-from-top-4 duration-700">
             {/* Base Settings */}
             <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Left side: Technical Settings (Position, Style, Timing) */}
                <div className="lg:col-span-2 space-y-8">
                   <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                      {/* Row 1: Position & Selector */}
                      {!isSpecial && (
                        <div className={settings.position !== 'inline' ? "col-span-2" : ""}>
                          <CustomSelect 
                            label={ts('position')}
                            value={settings.position}
                            onChange={(val) => onUpdate('position', val)}
                            options={[
                              { value: 'inline', label: ts('inline') },
                              { value: 'top-left', label: ts('top-left') },
                              { value: 'top-right', label: ts('top-right') },
                              { value: 'bottom-left', label: ts('bottom-left') },
                              { value: 'bottom-right', label: ts('bottom-right') }
                            ]}
                          />
                        </div>
                      )}
                      
                      {settings.position === 'inline' && !isSpecial && (
                         <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
                           <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">{ts('targetSelector')}</label>
                           <input 
                              type="text"
                              value={settings.targetSelector || ''}
                              onChange={(e) => onUpdate('targetSelector', e.target.value)}
                              placeholder={ts('targetSelectorPlaceholder')}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-bold text-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none placeholder:text-gray-600 transition-all uppercase tracking-tight h-[58px]"
                           />
                         </div>
                      )}

                      {/* Row 2: Appearance Style */}
                      <div className="col-span-2">
                        <CustomSelect 
                          label={ts('style')}
                          value={settings.style}
                          onChange={(val) => onUpdate('style', val)}
                          options={[
                            { value: 'dark', label: 'Slate Dark' },
                            { value: 'light', label: 'Snow Light' }
                          ]}
                        />
                      </div>

                      {/* Row 3: Timing (Delay & Auto Hide) */}
                      <div className="space-y-2">
                         <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">{ts('delay')}</label>
                         <input 
                           type="number"
                           value={settings.delay}
                           onChange={(e) => onUpdate('delay', parseInt(e.target.value) || 0)}
                           className="w-full h-[58px] bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">{ts('autoHide')}</label>
                         <input 
                           type="number"
                           value={settings.hideAfter}
                           onChange={(e) => onUpdate('hideAfter', parseInt(e.target.value) || 0)}
                           className="w-full h-[58px] bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                         />
                      </div>
                   </div>
                </div>

                {/* Right side: Content Template & URL Filtering */}
                <div className="lg:col-span-3 space-y-6">
                   <div className="flex flex-col">
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 pr-4 flex justify-between">
                        {ts('template')}
                        <span className="text-blue-500 lowercase font-bold italic">{'{count}, {code}, {product}'}</span>
                      </label>
                        <textarea 
                          rows={isSpecial ? 3 : 6}
                          value={settings.template}
                          onChange={(e) => onUpdate('template', e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm font-mono focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all resize-none"
                        />

                        {title === t('loyalty.title') && (
                          <div className="mt-6 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
                             <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 pr-4 flex justify-between">
                               {ts('templateLong')}
                               <span className="text-blue-500 lowercase font-bold italic">{'{count}, {code}, {product}'}</span>
                             </label>
                             <textarea 
                               rows={3}
                               value={settings.templateLong}
                               onChange={(e) => onUpdate('templateLong', e.target.value)}
                               className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm font-mono focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all resize-none"
                             />
                          </div>
                        )}
                   </div>

                   <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">
                        {ts('targetUrls')}
                      </label>
                      <textarea 
                        rows={isSpecial ? 3 : 4}
                        placeholder={ts('targetUrlsPlaceholder')}
                        value={settings.targetUrls || ''}
                        onChange={(e) => onUpdate('targetUrls', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm font-mono focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all resize-none"
                      />
                   </div>

                   {isScarcity && (
                      <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">
                          {ts('inventory')}
                        </label>
                        <textarea 
                          rows={3}
                          placeholder={ts('inventoryPlaceholder')}
                          value={settings.inventory || ''}
                          onChange={(e) => onUpdate('inventory', e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm font-mono focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all resize-none"
                        />
                      </div>
                   )}
                </div>
             </div>

             {/* Discount Configuration */}
             {hasDiscount && (
                <div className="p-8 bg-blue-600/5 rounded-3xl border border-blue-500/20 space-y-8">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <Zap size={20} className="text-blue-400" />
                         <h4 className="text-lg font-black text-blue-100 uppercase tracking-tight">{ts('discount')}</h4>
                      </div>
                      <button 
                        onClick={() => onUpdate('discountEnabled', !settings.discountEnabled)}
                        className={`text-xs font-black px-4 py-2 rounded-xl transition-all ${settings.discountEnabled ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400'}`}
                      >
                         {settings.discountEnabled ? 'ENABLED' : 'DISABLED'}
                      </button>
                   </div>

                   {settings.discountEnabled && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in zoom-in-95 duration-300">
                         <div className="space-y-6">
                            <CustomSelect 
                               label={ts('mode')}
                               value={settings.discountMode}
                               onChange={(val) => onUpdate('discountMode', val)}
                               options={[
                                 { value: 'code', label: 'Show Code' },
                                 { value: 'redirect', label: 'Redirect URL' },
                                 { value: 'api', label: 'Call API' }
                               ]}
                            />
                            
                            {settings.discountMode === 'code' && (
                               <div className="space-y-2">
                                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">{ts('code')}</label>
                                  <input 
                                    type="text"
                                    value={settings.discountCode}
                                    placeholder="SUMMER25"
                                    onChange={(e) => onUpdate('discountCode', e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-sm font-bold uppercase"
                                  />
                               </div>
                            )}

                            {settings.discountMode === 'redirect' && (
                               <div className="space-y-4">
                                  <div className="space-y-2">
                                     <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">{ts('url')}</label>
                                     <input 
                                       type="url"
                                       value={settings.redirectUrl}
                                       placeholder="https://..."
                                       onChange={(e) => onUpdate('redirectUrl', e.target.value)}
                                       className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-sm"
                                     />
                                  </div>
                                  <div className="space-y-2">
                                     <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">{ts('success')}</label>
                                     <input 
                                       type="text"
                                       value={settings.successMessage}
                                       placeholder="Applied successfully!"
                                       onChange={(e) => onUpdate('successMessage', e.target.value)}
                                       className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-sm"
                                     />
                                  </div>
                               </div>
                            )}
                         </div>

                         <div className="md:col-span-2 space-y-6">
                            {settings.discountMode === 'api' && (
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                     <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">{ts('api_url')}</label>
                                        <input 
                                          type="url"
                                          value={settings.apiUrl}
                                          onChange={(e) => onUpdate('apiUrl', e.target.value)}
                                          className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-sm"
                                        />
                                     </div>
                                     <div className="grid grid-cols-2 gap-4">
                                        <CustomSelect 
                                           label="Method"
                                           value={settings.apiMethod}
                                           onChange={(val) => onUpdate('apiMethod', val)}
                                           options={[{value:'GET', label:'GET'}, {value:'POST', label:'POST'}]}
                                        />
                                        <div className="space-y-2">
                                           <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">{ts('api_headers')}</label>
                                           <textarea 
                                             rows={1}
                                             value={settings.apiHeaders}
                                             onChange={(e) => onUpdate('apiHeaders', e.target.value)}
                                             className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-[10px] font-mono"
                                           />
                                        </div>
                                     </div>
                                  </div>
                                  <div className="space-y-2">
                                     <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">{ts('api_body')}</label>
                                     <textarea 
                                       rows={4}
                                       value={settings.apiBody}
                                       onChange={(e) => onUpdate('apiBody', e.target.value)}
                                       className="w-full h-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-[10px] font-mono"
                                     />
                                  </div>
                               </div>
                            )}

                            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-6">
                               <div className="flex-1 space-y-2 text-xs">
                                  <p className="font-bold text-gray-300">Advanced Triggers</p>
                                  <div className="flex gap-4">
                                     <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" checked={settings.autoCopy} onChange={e => onUpdate('autoCopy', e.target.checked)} className="hidden" />
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${settings.autoCopy ? 'bg-blue-600 border-blue-600' : 'border-white/10'}`}>
                                           {settings.autoCopy && <Check size={10} />}
                                        </div>
                                        <span className="text-gray-500 group-hover:text-gray-300 transition-colors">Auto Copy</span>
                                     </label>
                                     <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" checked={settings.autoRedirect} onChange={e => onUpdate('autoRedirect', e.target.checked)} className="hidden" />
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${settings.autoRedirect ? 'bg-blue-600 border-blue-600' : 'border-white/10'}`}>
                                           {settings.autoRedirect && <Check size={10} />}
                                        </div>
                                        <span className="text-gray-500 group-hover:text-gray-300 transition-colors">Auto Redirect</span>
                                     </label>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   )}
                </div>
             )}
          </div>
       )}
    </div>
  );
}

function Check({ size, className }: any) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
