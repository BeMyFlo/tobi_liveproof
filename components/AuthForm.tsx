"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t('errorGeneric'));
      } else {
        router.push(`/${locale}/dashboard`);
        router.refresh();
      }
    } catch (err) {
      setError(t('errorConnection'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto p-6 md:p-8 lg:p-10 bg-slate-900/40 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-2xl md:text-3xl font-black mb-6 md:mb-8 text-center italic uppercase tracking-tight">
        {mode === 'login' ? t('loginTitle') : t('registerTitle')}
      </h2>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-3 md:p-4 rounded-xl mb-6 text-[13px] md:text-sm text-center font-medium animate-in shake-in duration-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
        <div className="space-y-2">
          <label className="block text-[13px] md:text-sm font-black text-gray-400 uppercase tracking-widest pl-1">{t('emailLabel')}</label>
          <input
            type="email"
            required
            className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 text-[14px] md:text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-bold placeholder:text-gray-600"
            placeholder={t('emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[13px] md:text-sm font-black text-gray-400 uppercase tracking-widest pl-1">{t('passwordLabel')}</label>
          <input
            type="password"
            required
            className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 text-[14px] md:text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-bold placeholder:text-gray-600"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 md:h-14 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-[950] rounded-xl md:rounded-2xl transition-all shadow-xl shadow-blue-500/20 mt-4 uppercase tracking-widest text-[11px] md:text-xs italic"
        >
          {loading ? t('pleaseWait') : mode === 'login' ? t('loginBtn') : t('registerBtn')}
        </button>
      </form>
      
      <p className="mt-8 text-center text-gray-400 text-[13px] md:text-sm font-semibold italic">
        {mode === 'login' ? t('noAccount') : t('hasAccount')}
        <button 
          onClick={() => router.push(`/${locale}/${mode === 'login' ? 'register' : 'login'}`)}
          className="ml-2 text-blue-400 hover:text-white transition-colors font-black uppercase tracking-tight"
        >
          {mode === 'login' ? t('signUp') : t('signIn')}
        </button>
      </p>
    </div>
  );
}
