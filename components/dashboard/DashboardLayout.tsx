"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from './Sidebar';
import { useTranslations } from 'next-intl';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const tCommon = useTranslations('common');

  useEffect(() => {
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
        else router.push(`/${params.locale}/login`);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center transition-colors duration-500">
        <div className="text-slate-400 font-medium animate-pulse">{tCommon('loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-blue-500/30 transition-colors duration-500">
      <Sidebar plan={user?.plan} />
      <main className="lg:ml-64 p-4 md:p-8 lg:p-10 min-h-screen pt-24 lg:pt-10 transition-all duration-300">
        <div className="max-w-6xl mx-auto text-[14px] lg:text-base leading-relaxed">
          {children}
        </div>
      </main>
    </div>
  );
}
