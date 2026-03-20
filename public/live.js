(function() {
  const script = document.currentScript;
  const key = script.getAttribute('data-key');
  if (!key) return console.error('Tobi LiveProof: Missing data-key');

  const baseUrl = script.src.split('/live.js')[0];
  const containers = {};

  // Inject Styles
  const style = document.createElement('style');
  style.innerHTML = `
    .lp-stack { position:fixed; z-index:999998; display:flex; flex-direction:column; gap:12px; pointer-events:none; min-width:300px; padding:20px; }
    .lp-stack > * { pointer-events:auto; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .lp-top-left { top:0; left:0; }
    .lp-top-right { top:0; right:0; align-items: flex-end; }
    .lp-bottom-left { bottom:0; left:0; flex-direction: column-reverse; }
    .lp-bottom-right { bottom:0; right:0; align-items: flex-end; flex-direction: column-reverse; }

    .lp-compact { 
      width:48px; height:48px; border-radius:30px; overflow:hidden; white-space:nowrap; 
      display:flex; align-items:center; cursor:move; transition: width 0.4s ease, border-radius 0.4s ease;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2); user-select:none; position:relative;
    }
    .lp-compact:hover { width:280px; border-radius:30px; }
    .lp-compact-icon { min-width:48px; height:48px; display:flex; align-items:center; justify-content:center; font-size:22px; }
    .lp-compact-text { padding: 0 16px; font-weight:700; font-size:12px; opacity:0; transition: opacity 0.3s; pointer-events:none; flex-grow:1; }
    .lp-compact:hover .lp-compact-text { opacity:1; }

    @keyframes lp-pop { from { transform: scale(0); opacity:0; } to { transform: scale(1); opacity:1; } }
  `;
  document.head.appendChild(style);

  function getContainer(pos) {
    if (containers[pos]) return containers[pos];
    const div = document.createElement('div');
    div.className = `lp-stack lp-${pos}`;
    document.body.appendChild(div);
    containers[pos] = div;
    return div;
  }

  fetch(`${baseUrl}/api/widgets/all?key=${key}`)
    .then(res => res.json())
    .then(data => {
      if (data.widgets) {
        Object.keys(data.widgets).forEach(type => { if (type !== 'loyalty') initWidget(type, data.widgets[type]); });
      }
      if (data.campaigns) data.campaigns.forEach(c => initFlashSale(c));
      initVisitorTracking(data.widgets);
      if (data.seo && data.seo.enabled) initSEO(data.seo);
    });

  function initSEO(seoData) {
    const keywords = (seoData.keywords || '').split(',').map(k => k.trim()).filter(k => k);
    if (!keywords.length) return;
    const script = document.createElement('script');
    script.type = "application/ld+json";
    script.text = JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", "name": document.title, "keywords": keywords.join(', ') });
    document.head.appendChild(script);
  }

  function initVisitorTracking(widgets) {
    let vid = localStorage.getItem('lp_vid') || ('vid_'+Math.random().toString(36).substr(2,9)+Date.now());
    localStorage.setItem('lp_vid', vid);
    const email = window.lp_email || localStorage.getItem('lp_email');
    
    fetch(`${baseUrl}/api/track-visitor`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, visitorId: vid, url: window.location.href, email })
    }).then(r => r.json()).then(res => {
      const isNew = !sessionStorage.getItem('lp_session_seen');
      if (widgets?.welcome?.enabled && res.isReturning && isNew) showGreetingToast(widgets.welcome, res);
      if (isNew) sessionStorage.setItem('lp_session_seen', 'true');
      if (widgets?.loyalty?.enabled && res.allMilestones?.length) {
        initWidget('loyalty', { ...widgets.loyalty, orderCount: res.orderCount, milestones: res.allMilestones });
      }
    });
  }

  function showGreetingToast(s, res) {
    const text = (res.specialTrigger === 'LONG_TIME_NO_SEE' && s.templateLong) ? s.templateLong : s.template;
    if (!text) return;
    const pos = s.position || 'bottom-left';
    const toast = document.createElement('div');
    toast.style.cssText = `background:rgba(15,23,42,0.95);backdrop-filter:blur(10px);color:white;padding:16px 24px;border-radius:20px;font-family:Inter,sans-serif;font-size:14px;font-weight:700;box-shadow:0 15px 40px rgba(0,0,0,0.3);display:flex;align-items:center;gap:12px;cursor:pointer;animation:lp-pop 0.5s ease;`;
    toast.innerHTML = `<div style="width:32px;height:32px;background:rgba(59,130,246,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;">👋</div> <div style="display:flex;flex-direction:column;"><span style="font-size:10px;opacity:0.6;font-weight:900;">CHÀO MỪNG QUAY LẠI!</span><span>${text}</span></div>`;
    getContainer(pos).appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'scale(0.8)'; setTimeout(() => toast.remove(), 500); }, s.hideAfter || 8000);
    toast.onclick = () => toast.remove();
    makeDraggable(toast);
  }

  function initFlashSale(c) {
    if (c.status !== 'active') return;
    const now = new Date().getTime();
    if (now < new Date(c.startTime).getTime() || now > new Date(c.endTime).getTime()) return;
    if (!c.isGlobal && c.targetUrls?.length && !c.targetUrls.some(u => window.location.href.includes(u))) return;

    const el = document.createElement('div');
    el.className = 'lp-compact';
    el.style.display = 'none';
    el.style.background = c.themeColor || '#ef4444';
    el.style.color = 'white';
    el.innerHTML = `
      <div class="lp-compact-icon">🔥</div>
      <div class="lp-compact-text">${c.name.toUpperCase()} ĐANG CHẠY! <span style="background:rgba(0,0,0,0.2);padding:2px 6px;border-radius:6px;font-size:9px;margin-left:5px">XEM</span></div>
    `;
    getContainer('bottom-right').appendChild(el);
    el.style.display = 'flex';
    el.onclick = () => { if (!el.hasMoved) showStore(c); };
    makeDraggable(el);
  }

  function initWidget(type, s) {
    if (!s.enabled) return;
    if (s.targetUrls?.length && !s.targetUrls.some(u => window.location.href.includes(u))) return;

    const el = document.createElement('div');
    el.className = type === 'loyalty' ? 'lp-compact' : '';
    el.style.display = 'none';
    const pos = s.position || 'bottom-right';

    if (type === 'loyalty') {
      el.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
      el.style.color = 'white';
      el.innerHTML = `
        <div class="lp-compact-icon">🎁</div>
        <div class="lp-compact-text">CHƯƠNG TRÌNH LOYALTY <span style="font-size:9px;opacity:0.7;display:block">Nhấn để xem quà tặng</span></div>
      `;
      el.onclick = () => { if (!el.hasMoved) showLoyaltyOverlay(s); };
    } else {
      el.style.cssText = `background:${s.style==='dark'?'rgba(15,23,42,0.9)':'rgba(255,255,255,0.9)'};backdrop-filter:blur(10px);padding:12px 20px;border-radius:20px;color:${s.style==='dark'?'#fff':'#000'};box-shadow:0 10px 30px rgba(0,0,0,0.1);font-weight:700;font-size:13px;animation:lp-pop 0.5s ease;display:none;`;
    }

    const updateContent = (data) => {
      if (type === 'viewers') el.innerHTML = `👁️ ${s.template.replace('{count}', data || 0)}`;
      else if (type === 'purchases') el.innerHTML = `🛒 Ai đó vừa mua ${data?.productName || 'Sản phẩm'}`;
      else if (type === 'loyalty') {
        el.innerHTML = `
          <div class="lp-compact-icon">🎁</div>
          <div class="lp-compact-text" style="white-space:nowrap; overflow:hidden;">CHƯƠNG TRÌNH LOYALTY <span style="font-size:9px;opacity:0.7;display:block">Nhấn để xem quà tặng</span></div>
        `;
      }
      el.style.display = type === 'loyalty' ? 'flex' : 'block';
    };

    getContainer(pos).appendChild(el);
    makeDraggable(el);

    if (type === 'viewers') {
      const connect = () => {
        const ws = new WebSocket(`${window.location.protocol==='https:'?'wss':'ws'}://${baseUrl.replace(/^https?:\/\//,'')}/api/ws?key=${key}&page=${window.location.pathname}`);
        ws.onmessage = (e) => { const d = JSON.parse(e.data); if (d.type === 'update') updateContent(d.count); };
        ws.onclose = () => setTimeout(connect, 5000);
      };
      connect();
    } else if (type === 'purchases') {
      fetch(`${baseUrl}/api/purchases/latest?key=${key}`).then(r => r.json()).then(d => { if (d.purchases?.length) updateContent(d.purchases[0]); });
    } else if (type === 'loyalty') updateContent();
  }

  function makeDraggable(el) {
    let pos1=0, pos2=0, pos3=0, pos4=0;
    el.onmousedown = el.ontouchstart = (e) => {
      e = e || window.event;
      pos3 = e.clientX || e.touches[0].clientX;
      pos4 = e.clientY || e.touches[0].clientY;
      document.onmouseup = document.ontouchend = () => { document.onmousemove = document.ontouchmove = null; };
      document.onmousemove = document.ontouchmove = (ev) => {
        ev = ev || window.event;
        const cx = ev.clientX || ev.touches[0].clientX;
        const cy = ev.clientY || ev.touches[0].clientY;
        pos1 = pos3 - cx; pos2 = pos4 - cy; pos3 = cx; pos4 = cy;
        if (Math.abs(pos1) > 2 || Math.abs(pos2) > 2) el.hasMoved = true;
        el.style.position = 'fixed';
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
        el.style.bottom = el.style.right = 'auto';
        el.style.zIndex = 1000000;
        el.style.transition = 'none';
      };
      el.hasMoved = false;
    };
  }

  function showStore(c) {
    const o = document.createElement('div');
    o.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.98);backdrop-filter:blur(20px);z-index:10000000;display:flex;flex-direction:column;align-items:center;padding:60px 20px;overflow-y:auto;font-family:Inter,sans-serif;color:white;`;
    o.innerHTML = `<button id="lp-close" style="position:absolute;top:20px;right:24px;background:none;border:none;color:white;font-size:40px;cursor:pointer;opacity:0.5">&times;</button><div style="text-align:center;margin-bottom:40px"><div style="color:#ef4444;font-weight:900;letter-spacing:2px;font-size:12px">FLASH SALE KẾT THÚC SAU</div><div id="lp-timer" style="font-size:32px;font-weight:900;margin-top:10px">00:00:00</div><h2 style="font-size:42px;font-weight:900;margin:20px 0 10px">${c.name}</h2></div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px;width:100%;max-width:1100px">${c.products.map(p => `<div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:24px;padding:24px;display:flex;flex-direction:column;"><div style="width:100%;aspect-ratio:1;border-radius:16px;overflow:hidden;background:white;margin-bottom:15px"><img src="${p.image||''}" style="width:100%;height:100%;object-fit:contain" /></div><h3 style="font-size:18px;font-weight:700;margin-bottom:10px;height:44px;overflow:hidden">${p.name}</h3><div style="display:flex;align-items:baseline;gap:12px;margin-bottom:20px"><span style="font-size:24px;font-weight:900;color:#ef4444">${p.salePrice.toLocaleString()}đ</span><span style="font-size:14px;text-decoration:line-through;opacity:0.4">${p.originalPrice.toLocaleString()}đ</span></div><button class="lp-buy" data-url="${p.url}" data-code="${p.discountCode||c.globalDiscountCode||''}" style="width:100%;padding:14px;background:white;color:black;border:none;border-radius:12px;font-weight:900;cursor:pointer">CHỐT ĐƠN & COPY MÃ</button></div>`).join('')}</div>`;
    document.body.appendChild(o);
    o.querySelector('#lp-close').onclick = () => o.remove();
    o.querySelectorAll('.lp-buy').forEach(b => b.onclick = () => { const cd = b.getAttribute('data-code'); if (cd) { navigator.clipboard.writeText(cd); b.innerText = 'ĐÃ COPY MÃ!'; b.style.background = '#22c55e'; b.style.color = 'white'; } setTimeout(() => window.open(b.getAttribute('data-url'), '_blank'), 800); });
    const ut = () => { const diff = new Date(c.endTime).getTime() - Date.now(); if (diff <= 0) return o.querySelector('#lp-timer').innerText = '00:00:00'; const h=Math.floor(diff/3600000), m=Math.floor((diff%3600000)/60000), s=Math.floor((diff%60000)/1000); o.querySelector('#lp-timer').innerText = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`; };
    setInterval(ut, 1000); ut();
  }

  function showLoyaltyOverlay(l) {
    const ms = l.milestones || [], oc = l.orderCount || 0;
    const o = document.createElement('div');
    o.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.8);backdrop-filter:blur(20px);z-index:20000000;display:flex;align-items:center;justify-content:center;padding:20px;font-family:Inter,sans-serif;`;
    const progress = Math.min((oc / (ms.length ? ms[ms.length-1].threshold : 10)) * 100, 100);
    o.innerHTML = `<div style="background:#fff;width:100%;max-width:500px;border-radius:32px;overflow:hidden;position:relative;box-shadow:0 30px 60px rgba(0,0,0,0.3);text-align:left;"><button id="lp-loyalty-close-btn" style="position:absolute;top:20px;right:20px;background:#f1f5f9;border:none;width:36px;height:36px;border-radius:12px;cursor:pointer;font-size:20px;color:#64748b;z-index:9999;display:flex;align-items:center;justify-content:center;">&times;</button><div style="padding:40px;background:linear-gradient(135deg, #3b82f6, #2563eb);color:white;"><div style="display:flex;align-items:center;gap:15px;margin-bottom:20px;"><div style="width:48px;height:48px;background:rgba(255,255,255,0.2);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:24px;">💎</div><div><h3 style="margin:0;font-size:20px;font-weight:900;text-transform:uppercase;letter-spacing:1px;">Quà Tặng Loyalty</h3><p style="margin:0;font-size:12px;opacity:0.8;">Càng mua nhiều đơn, quà tặng càng lớn!</p></div></div><div style="background:rgba(255,255,255,0.1);padding:20px;border-radius:24px;border:1px solid rgba(255,255,255,0.1)"><div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:13px;font-weight:700;"><span>Tiến Trình Của Bạn</span><span>${oc} đơn hàng</span></div><div style="height:10px;background:rgba(255,255,255,0.2);border-radius:10px;overflow:hidden;"><div style="height:100%;width:${progress}%;background:#fff;border-radius:10px;transition:width 1s;"></div></div></div></div><div style="padding:40px;max-height:400px;overflow-y:auto;"><div style="display:flex;flex-direction:column;gap:30px;position:relative;padding-left:20px;border-left:2px dashed #e2e8f0;">${ms.map(m => { const r = oc >= m.threshold; return `<div style="position:relative;"><div style="position:absolute;left:-29px;top:0;width:16px;height:16px;background:${r?'#3b82f6':'#fff'};border:3px solid ${r?'#bfdbfe':'#e2e8f0'};border-radius:50%;z-index:1;"></div><div style="display:flex;justify-content:space-between;align-items:flex-start;"><div style="opacity:${r?1:0.5}"><h4 style="margin:0;font-size:15px;font-weight:800;color:#1e293b;">Mốc ${m.threshold} đơn hàng</h4><p style="margin:4px 0 0;font-size:12px;color:#64748b;font-style:italic;">${m.description || 'Nhận mã giảm giá đặc biệt'}</p></div><div style="text-align:right;">${r?`<div style="padding:10px 15px;background:#f0f9ff;border:2px dashed #0369a1;border-radius:12px;color:#0369a1;font-weight:900;font-size:13px;">${m.couponCode}</div>`:`<div style="padding:12px;background:#f8fafc;border-radius:12px;color:#94a3b8;font-size:18px;">🔒</div>`}</div></div></div>`; }).join('')}</div></div></div>`;
    document.body.appendChild(o);
    o.querySelector('#lp-loyalty-close-btn').onclick = (e) => { e.stopPropagation(); o.remove(); };
    o.onclick = (e) => { if (e.target === o) o.remove(); };
  }
})();
