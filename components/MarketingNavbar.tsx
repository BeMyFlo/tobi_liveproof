"use client";

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { locales } from '@/lib/i18n';
import { Zap } from 'lucide-react';

export default function MarketingNavbar() {
  const t = useTranslations('common');
  const locale = useLocale();

  const toggleLocale = locale === 'en' ? 'vi' : 'en';

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5 px-8 py-5 flex justify-between items-center bg-slate-950/50">
      <div className="flex items-center gap-10">
        <Link href={`/${locale}`} className="flex items-center gap-2 text-2xl font-black tracking-tighter">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
             <Zap size={18} fill="white" className="text-white" />
          </div>
          <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">LiveProof</span>
        </Link>
        <div className="hidden md:flex gap-8 text-xs font-black uppercase tracking-widest text-gray-400">
          <Link href={`/${locale}#features`} className="hover:text-blue-400 transition-colors">{t('features')}</Link>
          <Link href={`/${locale}#pricing`} className="hover:text-blue-400 transition-colors">{t('pricing')}</Link>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Link 
          href={`/${toggleLocale}`} 
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all uppercase text-[10px] font-black"
        >
          {toggleLocale}
        </Link>
        <div className="h-6 w-px bg-white/10 mx-2" />
        <Link href={`/${locale}/login`} className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
          {t('login')}
        </Link>
        <Link href={`/${locale}/register`} className="bg-white text-black hover:bg-blue-500 hover:text-white px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all shadow-xl shadow-white/5">
          {t('getStarted')}
        </Link>
      </div>
    </nav>
  );
}
