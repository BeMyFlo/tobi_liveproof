"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
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
      features: [t('features.widgets', { count: 1 }), '10,000 Impressions/mo', 'Community Support'],
      cta: 'Current Plan',
      color: 'slate'
    },
    {
      id: 'pro',
      icon: Rocket,
      name: tCommon('pro'),
      price: '79k',
      features: [t('features.widgets', { count: 10 }), t('features.unlimited'), t('features.customStyle'), '100,000 Impressions/mo', 'Email Support'],
      cta: tCommon('upgrade'),
      popular: true,
      color: 'blue'
    },
    {
      id: 'premium',
      icon: Crown,
      name: tCommon('premium'),
      price: '199k',
      features: [t('features.unlimited'), t('features.customStyle'), t('features.analytics'), 'Unlimited Impressions', 'Priority 24/7 Support'],
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
        // Create hidden form to submit to SePay
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
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="text-center">
          <h1 className="text-4xl font-black tracking-tight mb-4">{t('title')}</h1>
          <p className="text-gray-400 text-lg">{t('subtitle')}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {plans.map((plan) => {
             const isCurrent = user?.plan === plan.id;
             return (
               <div 
                 key={plan.id}
                 className={`relative glass-card p-10 rounded-[32px] border transition-all hover:scale-[1.02] duration-500 overflow-hidden flex flex-col ${plan.popular ? 'border-blue-500/50 bg-blue-500/[0.03]' : 'border-white/5 bg-white/5'}`}
               >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 px-6 py-2 bg-blue-600 text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
                       Most Popular
                    </div>
                  )}

                  <div className="mb-8">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.id === 'pro' ? 'bg-blue-600 text-white' : plan.id === 'premium' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-400'}`}>
                        <plan.icon size={28} />
                     </div>
                     <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                     <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black">{plan.price}</span>
                        <span className="text-gray-500 font-bold">/tháng</span>
                     </div>
                  </div>

                  <ul className="space-y-4 mb-10 flex-1">
                     {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-300">
                           <div className="mt-1 p-0.5 rounded-full bg-green-500/20 text-green-500">
                              <Check size={12} />
                           </div>
                           {feat}
                        </li>
                     ))}
                  </ul>

                  <button 
                    disabled={isCurrent}
                    onClick={() => handleUpgrade(plan.id)}
                    className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${isCurrent ? 'bg-white/5 text-gray-500 cursor-not-allowed' : plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                  >
                     {isCurrent ? t('current') : (plan.id === 'pro' || plan.id === 'premium' ? `Nâng cấp ${plan.name}` : plan.cta)}
                  </button>
               </div>
             );
           })}
        </div>

        <div className="p-10 rounded-[32px] border border-white/5 bg-gradient-to-r from-slate-900 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="space-y-2">
              <h4 className="text-xl font-bold">Need a Custom Enterprise Plan?</h4>
              <p className="text-gray-400 text-sm">Large scale business with 1M+ monthly views? Let's talk.</p>
           </div>
           <button className="px-8 py-4 bg-white text-black font-black text-sm uppercase rounded-2xl hover:bg-blue-400 hover:text-white transition-all">
              Contact Sales
           </button>
        </div>
      </div>
  );
}
