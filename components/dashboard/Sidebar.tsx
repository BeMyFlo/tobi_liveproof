"use client";

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  LayoutDashboard, 
  Layers, 
  Code2, 
  CreditCard, 
  LogOut,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar({ plan }: { plan: string }) {
  const tNav = useTranslations('nav');
  const tDash = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;

  const menuItems = [
    { name: tNav('overview'), href: `/${locale}/dashboard`, icon: LayoutDashboard },
    { name: tNav('widgets'), href: `/${locale}/dashboard/widgets`, icon: Layers },
    { name: tNav('embed'), href: `/${locale}/dashboard/embed`, icon: Code2 },
    { name: tNav('billing'), href: `/${locale}/dashboard/billing`, icon: CreditCard },
  ];

  // Get translated plan name if it exists in common, otherwise use raw string
  const planName = tCommon(plan.toLowerCase() as any) || plan;

  return (
    <div className="w-64 h-screen fixed left-0 top-0 bg-slate-950 border-r border-white/5 flex flex-col p-6 space-y-8 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">T</div>
        <span className="text-xl font-bold tracking-tight">LiveProof</span>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                isActive 
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 space-y-4">
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">
              {tDash('planInfo', { plan: '' }).replace(': ', '')}
            </span>
            <Zap size={14} className="text-yellow-400 fill-yellow-400" />
        </div>
        <div className="text-lg font-black italic uppercase text-white tracking-tight">
          {planName}
        </div>
        {plan !== 'premium' && (
          <Link 
            href={`/${locale}/dashboard/billing`}
            className="block text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-600/20"
          >
            {tCommon('upgrade')}
          </Link>
        )}
      </div>

      <button 
        onClick={async () => {
          await fetch('/api/auth/logout', { method: 'POST' });
          window.location.href = `/${locale}/login`;
        }}
        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 transition-colors text-sm font-medium"
      >
        <LogOut size={18} />
        {tCommon('logout')}
      </button>
    </div>
  );
}
