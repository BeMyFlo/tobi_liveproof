"use client";

import { useTranslations } from 'next-intl';
import MarketingNavbar from '@/components/MarketingNavbar';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ShoppingCart, Zap, Shield, BarChart3, Globe, ArrowRight, Play, Check, MousePointer2, Timer, Flame, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
  const t = useTranslations();
  const tLanding = useTranslations('landing');
  const tWidgets = useTranslations('widgets');
  const [showDemo, setShowDemo] = useState(false);
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden transition-colors duration-500">
      <MarketingNavbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 md:pt-44 pb-20 md:pb-32 px-4 md:px-6">
        {/* Glow Effects - Responsive position */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] md:h-[800px] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.1),transparent_70%)] -z-10 blur-[80px] md:blur-[120px]" />
        <div className="absolute top-[15%] right-[-20%] md:right-[-10%] w-[60%] md:w-[40%] h-[40%] bg-purple-600/5 md:bg-purple-600/10 blur-[80px] md:blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-6xl mx-auto text-center space-y-6 md:space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 md:px-6 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[9px] md:text-[11px] font-[900] uppercase tracking-[0.3em] backdrop-blur-md italic"
          >
            <Zap size={12} fill="currentColor" />
            TOBI LIVEPROOF
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-[6rem] font-[900] tracking-[-0.04em] leading-[1.1] md:leading-[0.9] italic"
          >
            {t('hero.title').split(' ').map((word: string, i: number) => (
              <span key={i} className={i > 1 ? "text-blue-500" : ""}>{word} </span>
            ))}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-semibold italic px-4"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center pt-4"
          >
            <Link href="/register" className="w-full sm:w-auto group relative px-8 md:px-10 py-4 md:py-5 bg-blue-600 hover:bg-blue-700 text-white font-[900] rounded-2xl transition-all shadow-[0_20px_40px_-10px_rgba(59,130,246,0.4)] hover:-translate-y-1 overflow-hidden uppercase tracking-widest text-[10px] md:text-xs italic">
               <span className="relative z-10 flex items-center justify-center gap-2">
                 {t('hero.cta')}
                 <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
               </span>
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            <button 
              onClick={() => setShowDemo(true)}
              className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-white/5 hover:bg-white/10 text-white font-[900] rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2 shadow-sm uppercase tracking-widest text-[10px] md:text-xs italic backdrop-blur-md"
            >
              <Play size={18} fill="currentColor" />
              {t('hero.demo')}
            </button>
          </motion.div>
        </div>

        {/* Dashboard Mockup Section */}
        <div className="max-w-6xl mx-auto mt-16 md:mt-28 relative px-2 md:px-4">
           <motion.div 
             initial={{ opacity: 0, y: 100 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4, duration: 1 }}
             className="relative glass-card rounded-[30px] md:rounded-[40px] border border-white/10 p-2 md:p-4 shadow-3xl bg-white/5"
           >
              <div className="bg-slate-900 rounded-[24px] md:rounded-[32px] overflow-hidden border border-white/5 aspect-[4/3] md:aspect-video relative">
                  {/* Mockup Header */}
                  <div className="absolute top-0 w-full h-10 md:h-14 bg-white/5 border-b border-white/5 flex items-center px-4 md:px-6 gap-3 z-10 backdrop-blur-xl">
                    <div className="flex gap-1.5 shrink-0">
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-red-400/40" />
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-yellow-400/40" />
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-green-400/40" />
                    </div>
                    <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">dashboard.liveproof.io</p>
                  </div>
                  
                  {/* Mockup Content Overlay */}
                  <AnimatePresence mode="wait">
                    {!isPreviewActive ? (
                      <motion.div 
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 flex items-center justify-center p-6"
                      >
                        <button 
                          onClick={() => setIsPreviewActive(true)}
                          className="group bg-slate-950/90 border border-blue-500/30 px-6 md:px-12 py-4 md:py-6 rounded-2xl md:rounded-3xl shadow-3xl backdrop-blur-2xl hover:border-blue-500 transition-all hover:scale-105"
                        >
                          <p className="text-sm md:text-2xl font-black italic text-blue-400 tracking-[0.2em] md:tracking-[0.3em] uppercase flex items-center justify-center gap-2 md:gap-4 transition-all group-hover:text-white">
                            <TrendingUp size={32} />
                            {t('hero.preview')}
                          </p>
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="dashboard"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 pt-10 md:pt-14 bg-slate-950/20 backdrop-blur-sm z-10"
                      >
                        <div className="grid grid-cols-12 h-full">
                          {/* Sidebar Mock - Hidden on ultra small */}
                          <div className="hidden sm:block col-span-2 border-r border-white/5 p-4 md:p-6 space-y-4">
                            {[1,2,3,4,5].map(i => <div key={i} className={`h-4 md:h-8 rounded-lg md:rounded-xl bg-white/5 border border-white/5 w-${i === 1 ? 'full' : '4/5'}`} />)}
                          </div>
                          {/* Main Content Mock */}
                          <div className="col-span-12 sm:col-span-10 p-4 md:p-10 space-y-4 md:space-y-8">
                             <div className="flex justify-between items-center">
                               <h2 className="text-xs md:text-2xl font-black italic uppercase italic tracking-tight">{tWidgets('title')}</h2>
                               <button onClick={() => setIsPreviewActive(false)} className="text-[8px] md:text-xs font-black text-slate-500 hover:text-white uppercase">✕ {tLanding('close')}</button>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                               {[tWidgets('viewers.title'), tWidgets('purchases.title'), tWidgets('exitIntent.title')].map((name, i) => (
                                 <div key={i} className={`p-3 md:p-6 bg-white/5 border border-white/10 rounded-xl md:rounded-3xl space-y-2 md:space-y-4 shadow-xl ${i > 0 ? 'hidden md:block' : ''}`}>
                                    <div className="flex justify-between items-center">
                                      <p className="font-black text-[8px] md:text-sm uppercase italic truncate pr-2">{name}</p>
                                      <div className={`w-8 h-4 md:w-10 md:h-5 rounded-full ${i === 0 ? 'bg-blue-600' : 'bg-slate-700'} relative shrink-0`}>
                                        <div className={`absolute top-0.5 md:top-1 w-2 md:w-3 h-2 md:h-3 rounded-full bg-white ${i === 0 ? 'right-0.5 md:right-1' : 'left-0.5 md:left-1'}`} />
                                      </div>
                                    </div>
                                    <div className="h-1 md:h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                      <div className={`h-full bg-blue-500 w-${i === 0 ? '4/5' : '1/2'}`} />
                                    </div>
                                 </div>
                               ))}
                             </div>
                             <div className="h-24 md:h-48 w-full bg-blue-600/5 border border-blue-500/10 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center italic">
                               <p className="text-blue-400 text-[10px] md:text-base font-bold opacity-50 px-4 text-center">{tLanding('growthChart')}</p>
                             </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Static Background of Mockup */}
                  <div className="pt-24 px-10 grid grid-cols-12 gap-8 opacity-10 hidden md:grid">
                    <div className="col-span-3 space-y-5">
                      {[1,2,3].map(i => <div key={i} className="h-10 w-full bg-white/5 rounded-xl border border-white/5" />)}
                    </div>
                    <div className="col-span-9 space-y-8">
                      <div className="grid grid-cols-3 gap-8">
                        {[1,2,3].map(i => <div key={i} className="h-32 bg-white/5 rounded-[2rem] border border-white/5" />)}
                      </div>
                    </div>
                  </div>
              </div>
           </motion.div>

           {/* Floating Demo Widgets - Hidden on mobile, only desktop visual flair */}
           <motion.div 
             initial={{ x: -20, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ delay: 0.6 }}
             className="absolute -bottom-10 -left-10 hidden 2xl:block bg-slate-900/90 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-3xl max-w-xs animate-bounce-subtle z-20 group hover:border-blue-500 transition-colors"
           >
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-blue-600 rounded-[1.25rem] flex items-center justify-center text-3xl shadow-xl shadow-blue-600/30">🔥</div>
                 <div>
                    <p className="font-black text-white text-lg tracking-tight">42 {tLanding('rights').includes('reserved') ? 'people' : 'người'}</p>
                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">{tWidgets('viewers.title')}</p>
                 </div>
              </div>
           </motion.div>

           <motion.div 
             initial={{ x: 20, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ delay: 0.8 }}
             className="absolute -top-10 -right-10 hidden 2xl:block bg-slate-900/90 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-3xl max-w-xs z-20 group hover:border-purple-500 transition-colors"
           >
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-purple-600 rounded-[1.25rem] flex items-center justify-center text-3xl shadow-xl shadow-purple-600/30">🛒</div>
                 <div>
                    <p className="font-black text-white text-lg tracking-tight">{tLanding('rights').includes('reserved') ? 'Just purchased!' : 'Vừa mua hàng!'}</p>
                    <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest italic">{tWidgets('purchases.title')}</p>
                 </div>
              </div>
           </motion.div>

           {/* Flash Sale Widget - Top Left */}
           <motion.div 
             initial={{ x: -20, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ delay: 1.0 }}
             className="absolute -top-12 -left-12 hidden 2xl:block bg-slate-900/90 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-3xl max-w-xs z-20 group hover:border-yellow-500 transition-colors"
           >
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-yellow-600 rounded-[1.25rem] flex items-center justify-center text-3xl shadow-xl shadow-yellow-600/30">⚡</div>
                 <div>
                    <p className="font-black text-white text-lg tracking-tight">Flash Sale 🔥</p>
                    <p className="text-[10px] text-yellow-400 font-black uppercase tracking-widest italic">Chỉ còn 02:45:12</p>
                 </div>
              </div>
           </motion.div>

           {/* Scarcity Widget - Bottom Right */}
           <motion.div 
             initial={{ x: 20, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ delay: 1.2 }}
             className="absolute -bottom-12 -right-12 hidden 2xl:block bg-slate-900/90 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-3xl max-w-xs z-20 group hover:border-orange-500 transition-colors"
           >
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-orange-600 rounded-[1.25rem] flex items-center justify-center text-3xl shadow-xl shadow-orange-600/30">⏳</div>
                 <div>
                    <p className="font-black text-white text-lg tracking-tight">{tLanding('rights').includes('reserved') ? 'Almost gone!' : 'Sắp cháy hàng!'}</p>
                    <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest italic">Chỉ còn 3 sản phẩm</p>
                 </div>
              </div>
           </motion.div>
        </div>
      </section>

      {/* Live Demo Trigger Area */}
      <AnimatePresence>
        {showDemo && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 sm:bottom-10 right-0 sm:right-10 z-[100] max-w-md w-full px-4 sm:px-6"
          >
            <div className="bg-slate-900/95 backdrop-blur-2xl p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-3xl space-y-6 relative">
              <button onClick={() => setShowDemo(false)} className="absolute top-4 md:top-6 right-4 md:right-6 text-slate-500 hover:text-white transition-colors">✕</button>
              <div className="flex items-center gap-4 md:gap-5">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-[1.1rem] md:rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-blue-600/20 shrink-0">
                  <Play fill="white" size={28} />
                </div>
                <div>
                  <h4 className="font-black text-base md:text-xl italic uppercase tracking-tight leading-tight">{tLanding('demoTitle')}</h4>
                  <p className="text-[10px] md:text-sm text-slate-400 font-semibold">{tLanding('demoDesc')}</p>
                </div>
              </div>
              <div className="p-4 md:p-5 bg-white/5 rounded-xl md:rounded-2xl border border-white/5 text-[10px] md:text-sm font-semibold text-slate-400 italic">
                {tLanding('demoInfo')}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Grid */}
      <section id="features" className="py-20 md:py-40 px-4 md:px-6 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-24 space-y-4 md:space-y-6">
            <h2 className="text-3xl md:text-6xl font-black tracking-tight italic uppercase">{tLanding('featuresTitle')}</h2>
            <p className="text-slate-500 font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-sm italic">{tLanding('featuresSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
            <FeatureCard title={tWidgets('viewers.title')} icon={Eye} desc={tWidgets('viewers.desc')} color="blue" />
            <FeatureCard title={tWidgets('purchases.title')} icon={ShoppingCart} desc={tWidgets('purchases.desc')} color="purple" />
            <FeatureCard title={tWidgets('exitIntent.title')} icon={MousePointer2} desc={tWidgets('exitIntent.desc')} color="orange" />
            <FeatureCard title={tWidgets('retention.title')} icon={TrendingUp} desc={tWidgets('retention.desc')} color="indigo" />
            <FeatureCard title={tWidgets('scarcity.title')} icon={Timer} desc={tWidgets('scarcity.desc')} color="green" />
            <FeatureCard title={t('common.upgrade')} icon={Zap} desc={tLanding('demoInfo').includes('real-time') ? 'Copy-paste 1 line of code to your website. No coding required.' : 'Copy-paste 1 dòng code duy nhất vào website là xong. Không cần lập trình.'} color="blue" />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-40 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[80%] md:w-[50%] h-[50%] bg-blue-600/5 md:bg-blue-600/10 blur-[100px] md:blur-[150px] -z-10" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-24 space-y-4 md:space-y-6">
            <h2 className="text-3xl md:text-6xl font-black tracking-tight italic uppercase">{tLanding('pricingTitle')}</h2>
            <p className="text-slate-500 font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-sm italic">{tLanding('pricingSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <PricingCard 
               plan={t('common.free')} 
               price="0" 
               desc={tLanding('rights').includes('reserved') ? 'Perfect for small shops' : 'Phù hợp cho shop nhỏ'}
               features={tLanding('rights').includes('reserved') ? ["500 views/month", "2 basic widgets", "Easy setup", "Community support"] : ["500 lượt xem/tháng", "2 Widget cơ bản", "Cài đặt dễ dàng", "Cộng đồng hỗ trợ"]}
            />
            <PricingCard 
               plan={t('common.pro')} 
               price="199k" 
               desc={tLanding('rights').includes('reserved') ? 'Best seller for SMEs' : 'Bán chạy nhất cho SMEs'}
               featured 
               features={tLanding('rights').includes('reserved') ? ["50,000 views/month", "All widgets", "Custom style", "Advanced analytics"] : ["50,000 lượt xem/tháng", "Đầy đủ Widget", "Tùy chỉnh giao diện", "Báo cáo phân tích"]}
            />
            <PricingCard 
               plan={t('common.premium')} 
               price="499k" 
               desc={tLanding('rights').includes('reserved') ? 'For large enterprises' : 'Dành cho doanh nghiệp lớn'}
               features={tLanding('rights').includes('reserved') ? ["Unlimited views", "Full premium features", "No LiveProof logo", "24/7 support"] : ["Vô hạn lượt xem", "Full tính năng cao cấp", "Xóa logo LiveProof", "Hỗ trợ 24/7"]}
            />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-16 md:py-24 border-t border-white/5 px-4 md:px-6 bg-slate-950/50 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 text-slate-500 font-black uppercase text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] italic">
            <div className="flex items-center gap-3 text-white not-italic shrink-0">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-blue-600/20">L</div>
              <span className="text-base md:text-lg font-black tracking-tighter">LiveProof</span>
            </div>
            <span className="text-center">&copy; 2024 Tobi LiveProof. {tLanding('rights')}</span>
            <div className="flex gap-6 md:gap-10">
              <Link href="#" className="hover:text-white transition-all text-[10px] md:text-xs">{tLanding('privacy')}</Link>
              <Link href="#" className="hover:text-white transition-all text-[10px] md:text-xs">{tLanding('terms')}</Link>
            </div>
        </div>
      </footer>
    </main>
  );
}

function PricingCard({ plan, price, desc, features, featured }: any) {
  const t = useTranslations('common');
  const tLanding = useTranslations('landing');
  return (
    <div className={`p-1 w-full rounded-[2.5rem] md:rounded-[3.5rem] transition-all duration-500 ${featured ? 'bg-gradient-to-b from-blue-500 to-purple-600' : 'bg-white/5'}`}>
       <div className="bg-slate-950 h-full w-full rounded-[2.4rem] md:rounded-[3.4rem] p-8 md:p-12 flex flex-col gap-6 md:gap-8">
          <div className="space-y-1.5 md:space-y-2 text-left">
             <div className="text-blue-500 font-black uppercase tracking-widest text-[8px] md:text-[10px] italic">{desc}</div>
             <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight">{plan}</h3>
          </div>
          <div className="flex items-baseline gap-1">
             <span className="text-3xl md:text-5xl font-[900] tracking-tighter uppercase">{price}</span>
             <span className="text-slate-500 font-bold uppercase text-[10px] md:text-xs">/{tLanding('rights').includes('reserved') ? 'Month' : 'Tháng'}</span>
          </div>
          <div className="space-y-3 md:space-y-4 flex-1 text-left">
             {features.map((f: string) => (
               <div key={f} className="flex items-center gap-3 text-[12px] md:text-sm text-slate-400 font-medium">
                  <Check size={16} className="text-green-500 shrink-0" />
                  <span className="truncate">{f}</span>
               </div>
             ))}
          </div>
          <Link href="/register" className={`py-3 md:py-4 text-center rounded-xl md:rounded-2xl font-black italic uppercase tracking-widest text-[10px] md:text-xs transition-all ${featured ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20' : 'bg-white/5 hover:bg-white/10 text-white'}`}>
             {t('getStarted')}
          </Link>
       </div>
    </div>
  );
}

function FeatureCard({ title, desc, icon: Icon, color }: any) {
  const colors: any = {
    blue: 'bg-blue-600/10 text-blue-500 border-blue-500/20 group-hover:bg-blue-600',
    purple: 'bg-purple-600/10 text-purple-400 border-purple-500/20 group-hover:bg-purple-600',
    orange: 'bg-orange-600/10 text-orange-400 border-orange-500/20 group-hover:bg-orange-600',
    indigo: 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20 group-hover:bg-indigo-600',
    green: 'bg-green-600/10 text-green-400 border-green-500/20 group-hover:bg-green-600',
  };

  return (
    <div className="group glass-card p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 shadow-2xl text-left">
      <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] flex items-center justify-center mb-6 md:mb-10 border transition-all duration-500 group-hover:text-white shadow-3xl ${colors[color]}`}>
        <Icon size={32} />
      </div>
      <h3 className="text-xl md:text-2xl font-black mb-4 md:mb-6 text-white italic uppercase tracking-tight">{title}</h3>
      <p className="text-slate-400 font-semibold leading-relaxed text-[14px] md:text-base">{desc}</p>
    </div>
  );
}
