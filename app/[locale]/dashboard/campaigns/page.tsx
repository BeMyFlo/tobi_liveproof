"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Calendar, Tag, Percent, ExternalLink, Play, Square } from "lucide-react";

export const dynamic = "force-dynamic";

export default function CampaignsPage() {
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
        { id: Math.random().toString(36).substr(2, 9), name: "", url: "", originalPrice: 0, salePrice: 0, discountCode: "" }
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
    if (!confirm("Xác nhận xóa chiến dịch này?")) return;
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
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Flash Sales 🔥</h1>
          <p className="text-gray-400">Tạo các chương trình ưu đãi khẩn cấp để thôi thúc khách mua hàng.</p>
        </div>
        <button 
          onClick={() => {
            setCurrentCampaign({ name: "", startTime: "", endTime: "", status: "draft", isGlobal: true, products: [] });
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 transition-all shadow-xl shadow-blue-500/20"
        >
          <Plus size={20} /> Tạo Chiến Dịch
        </button>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-20 text-center">
            <div className="text-6xl mb-6">🏜️</div>
            <h3 className="text-xl font-bold mb-2">Chưa có chiến dịch nào</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">Bắt đầu tạo chiến dịch Flash Sale đầu tiên để tăng doanh số ngay hôm nay.</p>
          </div>
        ) : (
          campaigns.map(cam => (
            <div key={cam._id} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex items-center justify-between hover:border-slate-700 transition-all">
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cam.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-slate-800 text-slate-500'}`}>
                  {cam.status === 'active' ? <Play fill="currentColor" /> : <Square fill="currentColor" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{cam.name}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(cam.startTime).toLocaleDateString()} - {new Date(cam.endTime).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Tag size={14} /> {cam.products.length} sản phẩm</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleStatus(cam)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest ${cam.status === 'active' ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'}`}
                >
                  {cam.status === 'active' ? 'Tạm Dừng' : 'Kích Hoạt'}
                </button>
                <button 
                  onClick={() => { setCurrentCampaign(cam); setShowModal(true); }}
                  className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl transition-all"
                >
                  <ExternalLink size={18} />
                </button>
                <button 
                  onClick={() => deleteCampaign(cam._id)}
                  className="bg-red-500/10 text-red-500 hover:bg-red-500/20 p-3 rounded-xl transition-all"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">🔥 Cấu hình Flash Sale</h2>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">Tên Chiến Dịch</label>
                <input 
                  type="text" 
                  value={currentCampaign.name}
                  onChange={e => setCurrentCampaign({ ...currentCampaign, name: e.target.value })}
                  placeholder="Ví dụ: Xả kho mùa hè"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all font-bold"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                <div>
                  <h4 className="font-bold">🌍 Hiển thị toàn trang web</h4>
                  <p className="text-xs text-gray-500">Bật để hiện Flash Sale ở tất cả các trang.</p>
                </div>
                <button 
                  onClick={() => setCurrentCampaign({ ...currentCampaign, isGlobal: !currentCampaign.isGlobal })}
                  className={`w-12 h-6 rounded-full transition-all relative ${currentCampaign.isGlobal ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${currentCampaign.isGlobal ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              {!currentCampaign.isGlobal && (
                <div>
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">Chỉ hiện ở các Link này (Mỗi dòng 1 link)</label>
                  <textarea 
                    value={currentCampaign.targetUrls?.join('\n')}
                    onChange={e => setCurrentCampaign({ ...currentCampaign, targetUrls: e.target.value.split('\n') })}
                    placeholder="/san-pham-hot"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all h-24 text-sm"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">Bắt Đầu</label>
                  <input 
                    type="datetime-local" 
                    value={currentCampaign.startTime ? new Date(new Date(currentCampaign.startTime).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                    onChange={e => setCurrentCampaign({ ...currentCampaign, startTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">Kết Thúc</label>
                  <input 
                    type="datetime-local" 
                    value={currentCampaign.endTime ? new Date(new Date(currentCampaign.endTime).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                    onChange={e => setCurrentCampaign({ ...currentCampaign, endTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest block">Danh sách sản phẩm</label>
                  <button onClick={addProduct} className="text-blue-500 font-bold text-sm hover:underline">+ Thêm sản phẩm</button>
                </div>
                
                <div className="space-y-4">
                  {currentCampaign.products.map((p: any, idx: number) => (
                    <div key={p.id} className="bg-slate-950 border border-slate-800 p-6 rounded-2xl relative group">
                      <button onClick={() => removeProduct(idx)} className="absolute top-2 right-2 text-red-500/50 hover:text-red-500"><Trash2 size={16} /></button>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <input 
                          placeholder="Tên sản phẩm"
                          value={p.name}
                          onChange={e => {
                            const newP = [...currentCampaign.products];
                            newP[idx].name = e.target.value;
                            setCurrentCampaign({ ...currentCampaign, products: newP });
                          }}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm"
                        />
                        <input 
                          placeholder="Link sản phẩm (URL)"
                          value={p.url}
                          onChange={e => {
                            const newP = [...currentCampaign.products];
                            newP[idx].url = e.target.value;
                            setCurrentCampaign({ ...currentCampaign, products: newP });
                          }}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="mb-4">
                        <input 
                          placeholder="Link ảnh sản phẩm (URL)"
                          value={p.image}
                          onChange={e => {
                            const newP = [...currentCampaign.products];
                            newP[idx].image = e.target.value;
                            setCurrentCampaign({ ...currentCampaign, products: newP });
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-blue-300"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500 text-sm">đ</span>
                          <input 
                            placeholder="Giá gốc" 
                            type="number"
                            value={p.originalPrice}
                            onChange={e => {
                              const newP = [...currentCampaign.products];
                              newP[idx].originalPrice = Number(e.target.value);
                              setCurrentCampaign({ ...currentCampaign, products: newP });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-sm"
                          />
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-red-500/50 text-sm">đ</span>
                          <input 
                            placeholder="Giá giảm" 
                            type="number"
                            value={p.salePrice}
                            onChange={e => {
                              const newP = [...currentCampaign.products];
                              newP[idx].salePrice = Number(e.target.value);
                              setCurrentCampaign({ ...currentCampaign, products: newP });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-sm text-red-400 font-bold"
                          />
                        </div>
                        <div className="relative">
                          <Tag size={14} className="absolute left-3 top-3 text-blue-500/50" />
                          <input 
                            placeholder="Mã giảm giá" 
                            value={p.discountCode}
                            onChange={e => {
                              const newP = [...currentCampaign.products];
                              newP[idx].discountCode = e.target.value;
                              setCurrentCampaign({ ...currentCampaign, products: newP });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-blue-400 font-black"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t border-slate-800">
                <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-750 p-4 rounded-2xl font-bold transition-all">Hủy</button>
                <button onClick={saveCampaign} className="flex-1 bg-blue-600 hover:bg-blue-700 p-4 rounded-2xl font-black transition-all shadow-xl shadow-blue-500/20">Lưu Chiến Dịch</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
