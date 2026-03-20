"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Star, 
  Plus, 
  Trash2, 
  Trophy, 
  Target, 
  Gift,
  X,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Copy,
  Zap,
  Settings,
  Info,
  Layout,
  Gauge,
  Palette,
  MousePointer2
} from 'lucide-react';

export default function LoyaltyPage() {
  const t = useTranslations('loyalty');
  const tCommon = useTranslations('common');
  const tWidgets = useTranslations('widgets');
  const [user, setUser] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apiTab, setApiTab] = useState<'custom' | 'woocommerce'>('woocommerce');
  const [newMilestone, setNewMilestone] = useState({
    threshold: 2,
    couponCode: '',
    description: ''
  });

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

  const phpSnippet = `add_action('woocommerce_thankyou', 'liveproof_tracker');

function liveproof_tracker($order_id) {
    if (!$order_id) return;
    $order = wc_get_order($order_id);
    $items = $order->get_items();
    $product_name = count($items) > 0 ? current($items)->get_name() : '';
    
    wp_remote_post('${baseUrl}/api/purchases', [
        'body' => json_encode([
            'apiKey' => '${user?.apiKey || 'YOUR_API_KEY'}',
            'product' => $product_name,
            'location' => $order->get_billing_city(),
            'customerName' => $order->get_billing_first_name(),
            'customerEmail' => $order->get_billing_email()
        ]),
        'headers' => ['Content-Type' => 'application/json']
    ]);
}`;

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchMilestones = async () => {
    try {
      const res = await fetch('/api/loyalty/milestones');
      const data = await res.json();
      setMilestones(data.milestones || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveWidgetSettings = async () => {
    setIsUpdating(true);
    try {
      const widgets = { ...user.widgets };
      if (!widgets.loyalty) widgets.loyalty = {};
      widgets.loyalty.enabled = true;

      await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ widgets })
      });
      setUser({ ...user, widgets });
      alert('Đã lưu cấu hình hiển thị!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateWidget = (field: string, value: any) => {
    if (!user) return;
    const newWidgets = { ...(user.widgets || {}) };
    if (!newWidgets.loyalty) newWidgets.loyalty = { enabled: true };
    newWidgets.loyalty[field] = value;
    setUser({ ...user, widgets: newWidgets });
  };

  useEffect(() => {
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => setUser(data.user));
    fetchMilestones();
  }, []);

  const loyaltySettings = user?.widgets?.loyalty || { enabled: true, position: 'bottom-left', style: 'light', targetUrls: [] };

  const handleSave = async () => {
    if (!newMilestone.couponCode || newMilestone.threshold < 1) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/loyalty/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMilestone)
      });
      if (res.ok) {
        setShowModal(false);
        setNewMilestone({ threshold: 2, couponCode: '', description: '' });
        fetchMilestones();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa cột mốc này?')) return;
    try {
      await fetch('/api/loyalty/milestones', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchMilestones();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-1 text-left">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white uppercase italic">
            Chương trình <span className="text-blue-600">Loyalty</span>
          </h1>
          <p className="text-slate-500 dark:text-gray-500 text-sm md:text-lg font-medium italic leading-relaxed">
            Thiết lập các cột mốc tri ân khách hàng thân thiết để tăng tỉ lệ mua lại.
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-xs font-black transition-all shadow-xl shadow-blue-600/30 uppercase tracking-widest italic active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          Thêm cột mốc
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Milestones & Integration */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Info Card */}
          <div className="p-8 md:p-10 rounded-[2.5rem] bg-indigo-600/5 border border-indigo-100 dark:border-indigo-500/10 flex flex-col md:flex-row items-center gap-10 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                <Trophy size={200} className="text-indigo-600" />
             </div>
             <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl shadow-indigo-600/40 animate-pulse-slow">
                <Star size={32} className="text-white fill-white" />
             </div>
             <div className="space-y-4 relative text-left">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight italic">Cơ chế hoạt động</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400 font-medium leading-relaxed italic">
                  Khi khách đạt mốc số lượng đơn hàng, Widget Thanh Tiến Trình sẽ hiện ra giúp họ thôi thúc mua thêm để nhận quà.
                </p>
             </div>
          </div>

          {/* Milestones List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {milestones.length > 0 ? (
              milestones.map((m) => (
                <div key={m._id} className="group relative p-8 rounded-[2rem] bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 hover:border-blue-500/40 transition-all duration-500 shadow-sm hover:shadow-xl">
                   <div className="absolute top-6 right-6 flex gap-2">
                      <button 
                        onClick={() => handleDelete(m._id)}
                        className="p-2 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100 dark:hover:bg-red-500/20"
                      >
                        <Trash2 size={16} />
                      </button>
                   </div>
                   
                   <div className="space-y-6 text-left">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black italic shadow-inner">
                            {m.threshold}
                         </div>
                         <span className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 tracking-widest italic border-b border-blue-500/20">Đơn hàng</span>
                      </div>

                      <div className="space-y-2">
                         <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                            {m.couponCode}
                         </h3>
                         <p className="text-sm text-slate-500 dark:text-gray-500 font-medium italic">
                            {m.description || 'Ưu đãi dành cho khách hàng thân thiết.'}
                         </p>
                      </div>
                   </div>
                </div>
              ))
            ) : (
              <div className="md:col-span-2 py-20 text-center rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/5 bg-slate-50/50">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                     <AlertCircle size={32} className="text-slate-300 dark:text-gray-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase italic text-center">Chưa có cột mốc nào</h3>
                  <button onClick={() => setShowModal(true)} className="text-blue-600 text-sm mt-2 font-bold hover:underline">Tạo mốc đầu tiên</button>
              </div>
            )}
          </div>

          {/* Integration Section */}
          <div className="space-y-8 pt-8 border-t border-slate-100 dark:border-white/5">
             <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 text-left">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white uppercase italic">Kết nối dữ liệu</h2>
                <div className="flex bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner shrink-0">
                   <button 
                      onClick={() => setApiTab('woocommerce')}
                      className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 ${apiTab === 'woocommerce' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-white/5' : 'text-slate-500'}`}
                   >
                      WooCommerce
                   </button>
                   <button 
                      onClick={() => setApiTab('custom')}
                      className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 ${apiTab === 'custom' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-white/5' : 'text-slate-500'}`}
                   >
                      API Tùy Chỉnh
                   </button>
                </div>
             </div>

             {apiTab === 'woocommerce' ? (
               <div className="rounded-[2rem] border border-slate-200 dark:border-purple-500/20 bg-slate-50 dark:bg-black/40 overflow-hidden text-left shadow-sm">
                  <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Mã cho functions.php</span>
                     <button 
                        onClick={() => copyCode(phpSnippet)}
                        className="p-2 bg-white dark:bg-white/5 hover:bg-slate-100 rounded-lg transition-all"
                     >
                        {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                     </button>
                  </div>
                  <div className="p-8 overflow-x-auto">
                     <pre className="text-xs font-mono text-slate-700 dark:text-blue-300 leading-relaxed scrollbar-hide">
                        {phpSnippet}
                     </pre>
                  </div>
               </div>
             ) : (
                <div className="p-8 rounded-[2rem] bg-indigo-600/5 border border-indigo-100 dark:border-indigo-500/10 space-y-6 text-left">
                    <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 italic">Endpoint POST gửi đơn hàng kèm email:</p>
                    <code className="block p-4 bg-white dark:bg-black/40 rounded-xl text-xs font-bold text-blue-600 break-all border border-indigo-100 dark:border-white/5">
                        {baseUrl}/api/purchases
                    </code>
                </div>
             )}

             <div className="p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 space-y-4 text-left">
                <div className="flex items-center gap-3">
                   <Zap size={18} className="text-amber-500" />
                   <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase italic">Xác thực mã giảm giá (Bảo mật)</h3>
                </div>
                <code className="block p-4 bg-white dark:bg-black/40 rounded-xl text-[10px] md:text-xs font-bold text-slate-700 dark:text-amber-400 break-all border border-amber-200/30">
                   {baseUrl}/api/loyalty/check?apiKey={user?.apiKey || '...'}&email=EMAIL&coupon=MÃ
                </code>
             </div>
          </div>
        </div>

        {/* Right: Widget Config Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="p-8 md:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 space-y-10 text-left shadow-2xl relative">
             <div className="flex items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                   <Gauge size={22} />
                </div>
                <div className="space-y-0.5">
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight italic">Cấu hình hiển thị</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Tùy chỉnh Widget Loyalty</p>
                </div>
             </div>

             <div className="space-y-8">
                {/* Target URLs */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <label className="text-[11px] font-black uppercase text-slate-400 dark:text-gray-500 tracking-[0.2em] italic flex items-center gap-2">
                        <Layout size={14} className="text-blue-600" />
                        Trang hiển thị
                     </label>
                     <div className="group relative">
                        <Info size={14} className="text-slate-300" />
                        <div className="absolute bottom-full mb-3 right-0 w-48 p-3 bg-slate-900 text-white text-[9px] rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-20 shadow-2xl leading-relaxed italic">
                           Dán link các trang bạn muốn hiện Widget (mỗi trang 1 dòng). Để trống để hiện toàn web.
                        </div>
                     </div>
                  </div>
                  <textarea 
                    value={Array.isArray(loyaltySettings.targetUrls) ? loyaltySettings.targetUrls.join('\n') : ''}
                    onChange={(e) => updateWidget('targetUrls', e.target.value.split('\n').map(l => l.trim()).filter(l => l))}
                    className="w-full h-32 p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 focus:ring-2 focus:ring-blue-500 outline-none text-xs font-mono italic shadow-inner"
                    placeholder="https://mysite.com/cart"
                  />
                </div>

                {/* Style & Position */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Vị trí</label>
                      <select 
                        value={loyaltySettings.position || 'bottom-left'}
                        onChange={(e) => updateWidget('position', e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-xs font-bold italic"
                      >
                         <option value="bottom-left">Bottom Left</option>
                         <option value="bottom-right">Bottom Right</option>
                         <option value="top-left">Top Left</option>
                         <option value="top-right">Top Right</option>
                      </select>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Giao diện</label>
                      <select 
                        value={loyaltySettings.style || 'light'}
                        onChange={(e) => updateWidget('style', e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-xs font-bold italic"
                      >
                         <option value="light">Light</option>
                         <option value="dark">Dark</option>
                      </select>
                   </div>
                </div>

                <button 
                  onClick={saveWidgetSettings}
                  disabled={isUpdating}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest italic transition-all shadow-xl shadow-blue-600/30 active:scale-95 disabled:opacity-50"
                >
                  {isUpdating ? 'ĐANG LƯU...' : 'LƯU CẤU HÌNH'}
                </button>
             </div>

             <div className="p-5 bg-indigo-600/5 rounded-2xl border border-indigo-100 dark:border-indigo-500/10 space-y-2">
                <div className="flex items-center gap-2">
                   <Palette size={14} className="text-indigo-600" />
                   <span className="text-[10px] font-bold text-slate-700 dark:text-indigo-300 uppercase italic">Gợi ý</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-gray-400 font-medium italic leading-relaxed">
                   Bạn nên hiện Widget này ở các trang **Cart/Checkout** để tạo thêm động lực thanh toán.
                </p>
             </div>
          </div>
        </aside>
      </div>

      {/* Add Milestone Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in zoom-in-95 duration-200">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl relative">
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-8 right-8 p-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-2xl text-slate-400 Transition-all"
              >
                <X size={20} />
              </button>

              <div className="p-12 md:p-16 space-y-10">
                 <div className="space-y-2 text-left">
                    <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] italic">Loyalty Milestone</p>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Cấu hình cột mốc</h2>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-3 text-left">
                       <label className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 tracking-widest italic flex items-center gap-2">
                          <Target size={12} className="text-blue-600" />
                          Số lượng đơn hàng yêu cầu
                       </label>
                       <input 
                         type="number"
                         value={newMilestone.threshold}
                         onChange={(e) => setNewMilestone({...newMilestone, threshold: parseInt(e.target.value)})}
                         className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-600 dark:text-blue-400 text-xl italic"
                       />
                    </div>

                    <div className="space-y-3 text-left">
                       <label className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 tracking-widest italic flex items-center gap-2">
                          <Gift size={12} className="text-purple-600" />
                          Mã giảm giá tặng kèm
                       </label>
                       <input 
                         type="text"
                         placeholder="VÍ DỤ: LOYALTY20, VIPDIAMOND..."
                         value={newMilestone.couponCode}
                         onChange={(e) => setNewMilestone({...newMilestone, couponCode: e.target.value.toUpperCase()})}
                         className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900 dark:text-white uppercase tracking-widest italic"
                       />
                    </div>
                 </div>

                 <div className="pt-6 flex gap-4">
                    <button 
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-gray-400 font-black uppercase text-[10px] tracking-widest rounded-2xl transition-all italic"
                    >
                      Hủy bỏ
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-2 grow py-5 bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-black/20 italic disabled:opacity-50"
                    >
                      {isSaving ? 'ĐANG LƯU...' : 'LƯU CỘT MỐC'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
