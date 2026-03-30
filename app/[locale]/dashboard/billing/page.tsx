"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Check, Zap, Rocket, Crown } from 'lucide-react';

export const dynamic = "force-dynamic";

export default function BillingPage() {
  const [user, setUser] = useState<any>(null);
  const t = useTranslations('billing');
  const tCommon = useTranslations('common');

  useEffect(() => {
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  const plans = [
    {
      id: 'free',
      icon: Zap,
      name: tCommon('free'),
      price: '0đ',
      features: [t('features.widgets', { count: 1 }), t('features.impressions', { count: '10,000' }), t('features.supportCommunity')],
      cta: t('current'),
      color: 'slate'
    },
    {
      id: 'pro',
      icon: Rocket,
      name: tCommon('pro'),
      price: '199k',
      features: [t('features.widgets', { count: 10 }), t('features.impressions', { count: '100,000' }), t('features.unlimited'), t('features.customStyle'), t('features.supportEmail')],
      cta: tCommon('upgrade'),
      popular: true,
      color: 'blue'
    },
    {
      id: 'premium',
      icon: Crown,
      name: tCommon('premium'),
      price: '499k',
      features: [t('features.unlimited'), t('features.impressionsUnlimited'), t('features.customStyle'), t('features.analytics'), t('features.supportPriority')],
      cta: tCommon('upgrade'),
      color: 'purple'
    }
  ];

  const handleUpgrade = async (plan: string) => {
    if (plan === 'free') return;
    try {
      const res = await fetch('/api/payment/sepay/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      });
      const data = await res.json();
      
      if (data.success) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.checkoutURL;
        
        Object.keys(data.fields).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = data.fields[key];
          form.appendChild(input);
        });
        
        document.body.appendChild(form);
        form.submit();
      } else {
        alert('Failed to initiate payment: ' + data.error);
      }
    } catch (err) {
      console.error('Upgrade error:', err);
      alert('Error connecting to payment gateway');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
        <header className="text-left px-1">
          <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tight mb-2">{t('title')}</h1>
          <p className="text-gray-400 text-[14px] md:text-lg font-medium italic">{t('subtitle')}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
           {plans.map((plan) => {
             const isCurrent = user?.plan === plan.id;
             return (
               <div 
                 key={plan.id}
                 className={`relative glass-card p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border transition-all hover:border-white/10 duration-500 overflow-hidden flex flex-col ${plan.popular ? 'border-blue-500/30 bg-blue-500/[0.03]' : 'border-white/5 bg-white/5'}`}
               >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 px-4 md:px-6 py-2 bg-blue-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-bl-xl shadow-lg shadow-blue-500/20 italic">
                       {t('mostPopular')}
                    </div>
                  )}

                  <div className="mb-6 md:mb-8 text-left">
                     <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 shadow-xl ${plan.id === 'pro' ? 'bg-blue-600 text-white shadow-blue-500/20' : plan.id === 'premium' ? 'bg-purple-600 text-white shadow-purple-500/20' : 'bg-white/10 text-gray-400'}`}>
                        <plan.icon size={26} />
                     </div>
                     <h3 className="text-xl md:text-2xl font-black italic uppercase italic tracking-tight mb-2">{plan.name}</h3>
                     <div className="flex items-baseline gap-1">
                        <span className="text-3xl md:text-4xl font-[900] tracking-tighter uppercase italic">{plan.price}</span>
                        <span className="text-gray-500 font-bold uppercase text-[9px] md:text-[10px] italic">/{t('perMonth')}</span>
                     </div>
                  </div>

                  <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10 flex-1">
                     {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-3 text-[13px] md:text-sm font-medium text-gray-300 text-left leading-snug italic">
                           <div className="mt-0.5 md:mt-1 p-0.5 rounded-full bg-green-500/20 text-green-500 shrink-0">
                              <Check size={12} strokeWidth={4} />
                           </div>
                           {feat}
                        </li>
                     ))}
                  </ul>

                  <button 
                    disabled={isCurrent}
                    onClick={() => handleUpgrade(plan.id)}
                    className={`h-12 md:h-14 w-full rounded-xl md:rounded-2xl font-[950] text-[11px] md:text-xs uppercase tracking-widest transition-all italic ${isCurrent ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5' : plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 active:scale-95' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}`}
                  >
                     {isCurrent ? t('current') : t('upgradeTo', { name: plan.name })}
                  </button>
               </div>
             );
           })}
        </div>

        <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 bg-slate-900/40 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-center md:text-left transition-all hover:border-white/10">
           <div className="space-y-2">
              <h4 className="text-lg md:text-xl font-black italic uppercase tracking-tight">{t('enterprise.title')}</h4>
              <p className="text-gray-400 text-[13px] md:text-sm font-medium italic">{t('enterprise.desc')}</p>
           </div>
           <button className="w-full md:w-auto h-12 md:h-14 px-8 bg-white text-black font-[950] text-[11px] md:text-xs uppercase rounded-xl md:rounded-2xl hover:bg-blue-500 hover:text-white transition-all shadow-xl active:scale-95 italic tracking-widest">
              {t('enterprise.cta')}
           </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
