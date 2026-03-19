"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useTranslations } from 'next-intl';
import { Copy, Eye, Users, MousePointer2 } from 'lucide-react';

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

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            {t('welcome', { name: user?.email.split('@')[0] })}
          </h1>
          <p className="text-gray-400 font-medium">Monitoring your social proof performance.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="glass-card p-8 rounded-3xl border border-white/5 bg-white/5 space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('apiKey')}</h3>
              <div className="flex items-center gap-3 bg-black/40 p-4 rounded-xl border border-white/5 group">
                <code className="flex-1 text-blue-400 font-mono text-sm truncate">{user?.apiKey}</code>
                <button 
                  onClick={copyKey}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  {copied ? <span className="text-xs text-green-400 font-bold uppercase">{tCommon('copied')}</span> : <Copy size={16} className="text-gray-400 group-hover:text-white" />}
                </button>
              </div>
           </div>

           <div className="glass-card p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-blue-600/10 to-purple-600/10 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Active Plan</span>
                <span className="px-3 py-1 bg-blue-600 text-[10px] font-black uppercase rounded-full">Pro Perks</span>
              </div>
              <p className="text-2xl font-bold capitalize">{user?.plan}</p>
              <p className="text-xs text-gray-400 mt-1">Next billing: April 17, 2026</p>
           </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <StatCard icon={Eye} label={t('views')} val={stats?.views || 0} color="blue" />
           <StatCard icon={Users} label="Total Clicks" val={stats?.clicks || 0} color="green" />
           <StatCard icon={MousePointer2} label="Conversion" val={(stats?.conversion || 0) + '%'} color="purple" />
        </section>
        
        <section className="glass-card p-10 rounded-3xl border border-white/5 bg-white/5">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Activity Recap</h2>
              <div className="text-xs font-bold text-gray-400">Last 7 Days</div>
           </div>
           <div className="h-64 flex items-end gap-2 px-2">
              {(stats?.chart || [0,0,0,0,0,0,0]).map((h: number, i: number) => {
                const max = Math.max(...(stats?.chart || [100]));
                const height = max > 0 ? (h / max) * 100 : 0;
                return (
                  <div 
                    key={i} 
                    className="flex-1 bg-blue-600/20 rounded-t-md hover:bg-blue-600 transition-all cursor-pointer relative group" 
                    style={{ height: `${height}%` }}
                  >
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {h}
                     </div>
                  </div>
                )
              })}
           </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon: Icon, label, val, color }: any) {
  const colors: any = {
    blue: "text-blue-500 bg-blue-500/10",
    green: "text-green-500 bg-green-500/10",
    purple: "text-purple-500 bg-purple-500/10"
  };
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/5 flex items-center gap-4 text-left">
      <div className={`p-3 rounded-xl ${colors[color]}`}>
        <Icon size={24} />
      </div>
      <div className="text-left">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider text-left">{label}</p>
        <p className="text-2xl font-bold text-left">{val}</p>
      </div>
    </div>
  );
}
