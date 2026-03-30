"use client";

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { locales } from '@/lib/i18n';
import { ModeToggle } from './ModeToggle';

export default function MarketingNavbar() {
  const t = useTranslations('common');
  const locale = useLocale();

  const toggleLocale = locale === 'en' ? 'vi' : 'en';

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-3 md:py-5 flex justify-between items-center bg-slate-950/90 text-white">
      <div className="flex items-center gap-4 md:gap-10">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <img src="/logo.png" alt="LiveProof" className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-2xl scale-110 md:scale-125 transition-transform" />
        </Link>
        <div className="hidden lg:flex gap-8 text-[10px] md:text-xs font-[900] uppercase tracking-widest text-slate-400">
          <Link href={`/${locale}#about`} className="hover:text-white transition-colors uppercase">{t('about')}</Link>
          <Link href={`/${locale}#features`} className="hover:text-white transition-colors uppercase">{t('features')}</Link>
          <Link href={`/${locale}#pricing`} className="hover:text-white transition-colors uppercase">{t('pricing')}</Link>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <ModeToggle />
        <Link 
          href={`/${toggleLocale}`} 
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all uppercase text-[8px] md:text-[10px] font-black shrink-0"
        >
          {toggleLocale}
        </Link>
        <div className="hidden sm:block h-6 w-px bg-white/10 mx-1" />
        <Link href={`/${locale}/login`} className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">{t('login')}</Link>
        <Link 
          href={`/${locale}/register`}
          className="px-5 md:px-8 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs tracking-[0.2em] uppercase transition-all shadow-lg shadow-blue-500/25 active:scale-95 whitespace-nowrap"
        >
          {t('getStarted')}
        </Link>
      </div>
    </nav>
  );
}
