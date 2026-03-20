"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, Eye, Users, MousePointer2, TrendingUp } from 'lucide-react';

export default function OverviewPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');

  useEffect(() => {
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => setUser(data.user));

    fetch('/api/analytics/summary')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  const copyKey = () => {
    navigator.clipboard.writeText(user?.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const planName = tCommon(user?.plan?.toLowerCase() as any) || user?.plan || 'Free';

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="px-1 text-left space-y-1">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t('welcome', { name: user?.email ? user.email.split('@')[0] : 'Merchant' })}
        </h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm md:text-base font-medium">{t('monitoring')}</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 space-y-4 text-left shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">{t('apiKey')}</h3>
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-black/40 p-4 rounded-xl border border-slate-100 dark:border-white/5 group">
              <code className="flex-1 text-blue-600 dark:text-blue-400 font-mono text-sm truncate">{user?.apiKey || 'pk_loading...'}</code>
              <button 
                onClick={copyKey}
                className="p-2 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 rounded-lg transition-all shrink-0"
              >
                {copied ? <span className="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase">{tCommon('copied')}</span> : <Copy size={16} className="text-slate-400 dark:text-gray-400 group-hover:text-blue-600" />}
              </button>
            </div>
         </div>

         <div className="p-6 md:p-8 rounded-2xl border border-blue-200 dark:border-white/5 bg-blue-50/50 dark:bg-blue-600/10 flex flex-col justify-center text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
               <TrendingUp size={100} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{t('activePlan')}</span>
              <span className="px-2.5 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase rounded-full shadow-lg shadow-blue-500/20">{t('proPerks')}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight relative z-10">{planName}</p>
            <p className="text-[12px] text-slate-400 dark:text-gray-500 mt-1 font-medium relative z-10">{t('nextBilling', { date: 'April 17, 2026' })}</p>
         </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <StatCard icon={Eye} label={t('views')} val={stats?.views || 0} color="blue" />
         <StatCard icon={Users} label={t('totalClicks')} val={stats?.clicks || 0} color="green" />
         <StatCard icon={MousePointer2} label={t('conversion')} val={(stats?.conversion || 0) + '%'} color="purple" />
      </section>
      
      <section className="p-8 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 text-left overflow-hidden shadow-sm">
         <div className="flex items-baseline justify-between mb-10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{t('activityRecap')}</h2>
            <div className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">{t('last7Days')}</div>
         </div>
         
         <div className="h-48 md:h-64 flex items-end gap-2 md:gap-4 px-1 pb-2 border-b border-slate-100 dark:border-white/5">
            {(stats?.chart || [0,0,0,0,0,0,0]).map((h: number, i: number) => {
              const max = Math.max(...(stats?.chart || [100]));
              const height = max > 0 ? (h / max) * 100 : 0;
              return (
                <div 
                  key={i} 
                  className="flex-1 bg-blue-600/10 dark:bg-blue-600/10 rounded-t-xl hover:bg-blue-600 dark:hover:bg-blue-500 transition-all cursor-pointer relative group" 
                  style={{ height: `${height > 5 ? height : 5}%` }}
                >
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-black text-[11px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl pointer-events-none z-10 whitespace-nowrap">
                      {h} {t('views').toLowerCase()}
                   </div>
                </div>
              )
            })}
         </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, val, color }: any) {
  const colors: any = {
    blue: "text-blue-600 dark:text-blue-400 bg-blue-600/10",
    green: "text-green-600 dark:text-green-400 bg-green-600/10",
    purple: "text-purple-600 dark:text-purple-400 bg-purple-600/10"
  };
  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 flex items-center gap-5 text-left transition-all hover:border-blue-500/20 shadow-sm">
      <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center shrink-0`}>
        <Icon size={24} />
      </div>
      <div className="text-left overflow-hidden">
        <p className="text-slate-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-0.5 truncate">{label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight truncate">{val}</p>
      </div>
    </div>
  );
}
