"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  LayoutDashboard, 
  Layers, 
  Code2, 
  CreditCard, 
  LogOut,
  Zap,
  Flame,
  Menu,
  X,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModeToggle } from '../ModeToggle';

export default function Sidebar({ plan }: { plan: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const tNav = useTranslations('nav');
  const tDash = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;

  // Close sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const menuItems = [
    { name: tNav('overview'), href: `/${locale}/dashboard`, icon: LayoutDashboard },
    { name: tNav('widgets'), href: `/${locale}/dashboard/widgets`, icon: Layers },
    { name: tNav('flashSales'), href: `/${locale}/dashboard/campaigns`, icon: Flame },
    { name: tNav('loyalty'), href: `/${locale}/dashboard/loyalty`, icon: Star },
    { name: tNav('seo'), href: `/${locale}/dashboard/seo`, icon: Zap },
    { name: tNav('embed'), href: `/${locale}/dashboard/embed`, icon: Code2 },
    { name: tNav('billing'), href: `/${locale}/dashboard/billing`, icon: CreditCard },
  ];

  const planName = tCommon(plan?.toLowerCase() as any) || plan || 'Free';

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-6 left-6 z-40 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-blue-600 dark:text-blue-400 shadow-xl"
      >
        <Menu size={20} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={cn(
        "fixed left-0 top-0 h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/5 flex flex-col p-6 space-y-8 z-[60] transition-all duration-300 ease-in-out w-72 lg:w-64",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="LiveProof" className="w-10 h-10 object-contain" />
            <span className="font-bold text-xl tracking-tight dark:text-white">LiveProof</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X size={20} />
          </button>
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
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                    : "text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                )}
              >
                <item.icon size={18} className={cn(isActive ? "text-white" : "text-slate-400 dark:text-gray-500")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 space-y-3">
          <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-gray-500 tracking-wider">
                {tDash('activePlan')}
              </span>
              <Zap size={14} className="text-yellow-500 fill-yellow-500" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {planName}
          </div>
          {plan !== 'premium' && (
            <Link 
              href={`/${locale}/dashboard/billing`}
              className="block text-center py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all shadow-md"
            >
              {tCommon('upgrade')}
            </Link>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/5">
          <button 
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              window.location.href = `/${locale}/login`;
            }}
            className="flex items-center gap-3 px-2 py-2 text-slate-500 dark:text-gray-400 hover:text-red-500 transition-colors text-sm font-medium"
          >
            <LogOut size={18} />
            {tCommon('logout')}
          </button>
          <ModeToggle />
        </div>
      </div>
    </>
  );
}
