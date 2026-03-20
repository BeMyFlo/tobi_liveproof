"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Calendar, Tag, ExternalLink, Play, Square, X, Zap } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export const dynamic = "force-dynamic";

export default function CampaignsPage() {
  const t = useTranslations('campaigns');
  const tCommon = useTranslations('common');
  
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<any>({
    name: "",
    startTime: "",
    endTime: "",
    status: "draft",
    isGlobal: true,
    products: []
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/campaigns");
      const data = await res.json();
      setCampaigns(data.campaigns || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const addProduct = () => {
    setCurrentCampaign({
      ...currentCampaign,
      products: [
        ...currentCampaign.products,
        { id: Math.random().toString(36).substr(2, 9), name: "", url: "", image: "", originalPrice: 0, salePrice: 0, discountCode: "" }
      ]
    });
  };

  const removeProduct = (idx: number) => {
    const newProducts = [...currentCampaign.products];
    newProducts.splice(idx, 1);
    setCurrentCampaign({ ...currentCampaign, products: newProducts });
  };

  const saveCampaign = async () => {
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentCampaign)
      });
      if (res.ok) {
        setShowModal(false);
        fetchCampaigns();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return;
    try {
      await fetch(`/api/campaigns?id=${id}`, { method: "DELETE" });
      fetchCampaigns();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (cam: any) => {
    const newStatus = cam.status === "active" ? "inactive" : "active";
    try {
      await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cam, status: newStatus })
      });
      fetchCampaigns();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white dark:bg-slate-900/40 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 gap-6 shadow-sm">
        <div className="text-left space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('title')}</h1>
          <p className="text-slate-500 dark:text-gray-400 font-medium">{t('subtitle')}</p>
        </div>
        <button 
          onClick={() => {
            setCurrentCampaign({ name: "", startTime: "", endTime: "", status: "draft", isGlobal: true, products: [] });
            setShowModal(true);
          }}
          className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 text-sm uppercase tracking-wider"
        >
          <Plus size={18} /> {t('createBtn')}
        </button>
      </header>

      <div className="grid gap-6">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 shadow-xl"></div>
            <p className="text-sm font-medium text-slate-400 dark:text-gray-500 uppercase tracking-widest">{tCommon('loading')}</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/10 border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-16 text-center shadow-sm">
            <div className="text-6xl mb-6">🏝️</div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('noCampaigns')}</h3>
            <p className="text-slate-500 dark:text-gray-500 max-w-sm mx-auto mb-8 font-medium italic">{t('noCampaignsDesc')}</p>
          </div>
        ) : (
          campaigns.map(cam => (
            <div key={cam._id} className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl p-6 flex flex-col lg:flex-row items-center justify-between hover:border-blue-500/20 transition-all gap-6 text-left shadow-sm group">
              <div className="flex items-center gap-5 w-full">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${cam.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  {cam.status === 'active' ? <Play fill="currentColor" size={20} className="animate-pulse" /> : <Square fill="currentColor" size={20} />}
                </div>
                <div className="overflow-hidden space-y-1 flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate uppercase">{cam.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-gray-400 font-bold italic">
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-500" /> {new Date(cam.startTime).toLocaleDateString()} - {new Date(cam.endTime).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><Tag size={14} className="text-purple-500" /> {t('productCount', { count: cam.products.length })}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <button 
                  onClick={() => toggleStatus(cam)}
                  className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl font-bold text-[11px] border uppercase tracking-wider transition-all shadow-md ${cam.status === 'active' ? 'bg-orange-500/10 text-orange-600 border-orange-200 hover:bg-orange-600 hover:text-white' : 'bg-green-500/10 text-green-600 border-green-200 hover:bg-green-600 hover:text-white'}`}
                >
                  {cam.status === 'active' ? t('statusPause') : t('statusActive')}
                </button>
                <button 
                  onClick={() => { setCurrentCampaign(cam); setShowModal(true); }}
                  className="bg-slate-50 dark:bg-white/5 hover:bg-blue-600 hover:text-white p-3 rounded-lg border border-slate-200 dark:border-white/5 transition-all shadow-sm text-slate-500 dark:text-gray-400"
                >
                  <ExternalLink size={18} />
                </button>
                <button 
                  onClick={() => deleteCampaign(cam._id)}
                  className="bg-red-500/10 text-red-600 dark:text-red-500 hover:bg-red-600 hover:text-white p-3 rounded-lg border border-red-200 dark:border-red-500/10 transition-all shadow-sm"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-200 relative scrollbar-hide">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-8 right-8 p-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl text-slate-400 dark:text-gray-400 transition-all z-10"
            >
              <X size={24} />
            </button>

            <h2 className="text-3xl font-bold tracking-tight mb-10 pr-12 text-slate-900 dark:text-white flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 text-white">
                 <Plus size={24} />
              </div>
              {t('modalTitle')}
            </h2>
            
            <div className="space-y-10 text-left">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider pl-1">{t('nameLabel')}</label>
                <input 
                  type="text" 
                  value={currentCampaign.name}
                  onChange={e => setCurrentCampaign({ ...currentCampaign, name: e.target.value })}
                  placeholder={t('namePlaceholder')}
                  className="w-full h-14 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-6 font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400 shadow-inner"
                />
              </div>

              <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-2xl shadow-inner gap-6">
                <div>
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white">{t('globalToggle')}</h4>
                  <p className="text-sm text-slate-500 dark:text-gray-500 font-medium mt-0.5">{t('globalDesc')}</p>
                </div>
                <button 
                  onClick={() => setCurrentCampaign({ ...currentCampaign, isGlobal: !currentCampaign.isGlobal })}
                  className={`w-14 h-7 rounded-full transition-all relative shrink-0 ${currentCampaign.isGlobal ? 'bg-blue-600 shadow-lg shadow-blue-500/20' : 'bg-slate-300 dark:bg-slate-800'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${currentCampaign.isGlobal ? 'left-8' : 'left-1'}`}></div>
                </button>
              </div>

              {!currentCampaign.isGlobal && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <label className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider pl-1">{t('targetUrlsLabel')}</label>
                  <textarea 
                    value={Array.isArray(currentCampaign.targetUrls) ? currentCampaign.targetUrls.join('\n') : ''}
                    onChange={e => setCurrentCampaign({ ...currentCampaign, targetUrls: e.target.value.split('\n') })}
                    placeholder="/san-pham-hot"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[1.5rem] px-6 py-4 focus:outline-none focus:border-blue-500 transition-all h-32 text-sm font-mono shadow-inner"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider pl-1">{t('startLabel')}</label>
                  <input 
                    type="datetime-local" 
                    value={currentCampaign.startTime ? new Date(new Date(currentCampaign.startTime).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                    onChange={e => setCurrentCampaign({ ...currentCampaign, startTime: e.target.value })}
                    className="w-full h-14 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-5 text-sm font-medium focus:outline-none focus:border-blue-500 transition-all text-slate-900 dark:text-white shadow-inner"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider pl-1">{t('endLabel')}</label>
                  <input 
                    type="datetime-local" 
                    value={currentCampaign.endTime ? new Date(new Date(currentCampaign.endTime).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                    onChange={e => setCurrentCampaign({ ...currentCampaign, endTime: e.target.value })}
                    className="w-full h-14 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-5 text-sm font-medium focus:outline-none focus:border-blue-500 transition-all text-slate-900 dark:text-white shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-8 pt-6">
                <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 px-1">
                  <label className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">{t('productList')}</label>
                  <button onClick={addProduct} className="bg-blue-600/10 hover:bg-blue-600 text-blue-600 hover:text-white font-bold text-[11px] px-5 py-2 rounded-lg transition-all uppercase tracking-wider border border-blue-200 dark:border-blue-500/20 shadow-sm">+ {t('addProduct')}</button>
                </div>
                
                <div className="space-y-8">
                  {currentCampaign.products.map((p: any, idx: number) => (
                    <div key={p.id} className="bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-white/5 p-8 rounded-[2rem] relative group animate-in fade-in duration-500 shadow-sm border-dashed">
                      <button onClick={() => removeProduct(idx)} className="absolute top-6 right-6 text-red-400 opacity-40 hover:opacity-100 hover:bg-red-500 hover:text-white transition-all p-2.5 rounded-xl bg-white dark:bg-white/5 shadow-xl"><Trash2 size={18} /></button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 dark:text-gray-600 uppercase tracking-wider pl-1">{t('productName')}</label>
                          <input 
                            value={p.name}
                            onChange={e => {
                              const newP = [...currentCampaign.products];
                              newP[idx].name = e.target.value;
                              setCurrentCampaign({ ...currentCampaign, products: newP });
                            }}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-3 text-sm font-bold text-slate-900 dark:text-white focus:border-blue-500 outline-none shadow-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 dark:text-gray-600 uppercase tracking-wider pl-1">{t('productUrl')}</label>
                          <input 
                            value={p.url}
                            onChange={e => {
                              const newP = [...currentCampaign.products];
                              newP[idx].url = e.target.value;
                              setCurrentCampaign({ ...currentCampaign, products: newP });
                            }}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-3 text-xs font-mono text-blue-600 dark:text-blue-400 outline-none shadow-sm"
                          />
                        </div>
                      </div>

                      <div className="mt-6 mb-8">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-gray-600 uppercase tracking-wider pl-1 mb-2 block">{t('productImage')}</label>
                        <input 
                          value={p.image}
                          onChange={e => {
                            const newP = [...currentCampaign.products];
                            newP[idx].image = e.target.value;
                            setCurrentCampaign({ ...currentCampaign, products: newP });
                          }}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-3 text-xs font-mono text-purple-600 dark:text-purple-300 outline-none shadow-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 dark:text-gray-600 uppercase tracking-wider pl-1">{t('originalPriceLabel')}</label>
                          <input 
                            type="number"
                            value={p.originalPrice}
                            onChange={e => {
                              const newP = [...currentCampaign.products];
                              newP[idx].originalPrice = Number(e.target.value);
                              setCurrentCampaign({ ...currentCampaign, products: newP });
                            }}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-3 text-sm font-medium text-slate-500 dark:text-gray-400 outline-none shadow-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 dark:text-gray-600 uppercase tracking-wider pl-1">{t('salePriceLabel')}</label>
                          <input 
                            type="number"
                            value={p.salePrice}
                            onChange={e => {
                              const newP = [...currentCampaign.products];
                              newP[idx].salePrice = Number(e.target.value);
                              setCurrentCampaign({ ...currentCampaign, products: newP });
                            }}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-3 text-base font-bold text-red-600 dark:text-red-400 outline-none shadow-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 dark:text-gray-600 uppercase tracking-wider pl-1">{t('discountCodeLabel')}</label>
                          <input 
                            value={p.discountCode}
                            onChange={e => {
                              const newP = [...currentCampaign.products];
                              newP[idx].discountCode = e.target.value;
                              setCurrentCampaign({ ...currentCampaign, products: newP });
                            }}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-3 text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider outline-none shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-10 border-t border-slate-100 dark:border-white/5">
                <button onClick={() => setShowModal(false)} className="order-2 sm:order-1 flex-1 h-12 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-white rounded-xl font-bold transition-all uppercase tracking-wider text-xs">{t('cancel')}</button>
                <button onClick={saveCampaign} className="order-1 sm:order-2 flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg text-xs uppercase tracking-wider">{t('save')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
