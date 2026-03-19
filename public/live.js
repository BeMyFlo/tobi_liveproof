(function() {
  const script = document.currentScript;
  const key = script.getAttribute('data-key');
  
  if (!key) return console.error('Tobi LiveProof: Missing data-key');

  const baseUrl = script.src.split('/live.js')[0];
  const browserLang = navigator.language.startsWith('vi') ? 'vi' : 'en';

  const strings = {
    viewers: { en: 'people are viewing this page', vi: 'người đang xem trang này' },
    purchases: { en: 'Someone just purchased', vi: 'Ai đó vừa mới mua' },
    exit: { en: 'Wait! Don\'t leave empty handed!', vi: 'Khoan đã! Đừng rời đi tay trắng!' },
    stay: { en: 'Thanks for your interest!', vi: 'Cảm ơn bạn đã quan tâm!' },
    selling: { en: 'Selling fast today', vi: 'Đang bán rất chạy' },
    copied: { en: 'Code copied!', vi: 'Đã sao chép mã!' },
    loyalty: { en: 'Welcome back! It has been a while.', vi: 'Chào mừng bạn quay lại! Đã lâu không gặp.' }
  };

  fetch(`${baseUrl}/api/widgets/all?key=${key}`)
    .then(res => res.json())
    .then(data => {
      console.log('Tobi LiveProof: Data loaded', data);
      
      // 1. Initialize Widgets
      if (data.widgets) {
        Object.keys(data.widgets).forEach(type => {
          if (type !== 'loyalty') {
            initWidget(type, data.widgets[type]);
          }
        });
      }

      // 2. Initialize Flash Sales
      if (data.campaigns && data.campaigns.length > 0) {
        data.campaigns.forEach(campaign => initFlashSale(campaign));
      }

      // 3. Visitor Tracking & Loyalty
      initVisitorTracking(data.widgets?.loyalty);
    });

  function initVisitorTracking(loyaltySettings) {
    let visitorId = localStorage.getItem('lp_vid');
    if (!visitorId) {
      visitorId = 'vid_' + Math.random().toString(36).substring(2, 15) + Date.now();
      localStorage.setItem('lp_vid', visitorId);
    }

    fetch(`${baseUrl}/api/track-visitor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, visitorId, url: window.location.href })
    }).then(res => res.json()).then(res => {
      const isNewSession = !sessionStorage.getItem('lp_session_seen');
      if (isNewSession && res.isReturning && loyaltySettings?.enabled) {
        sessionStorage.setItem('lp_session_seen', 'true');
        const welcomeText = res.specialTrigger === 'LONG_TIME_NO_SEE' 
          ? (loyaltySettings.templateLong || strings.loyalty[browserLang]) 
          : (loyaltySettings.template || (browserLang === 'vi' ? 'Chào mừng bạn quay lại!' : 'Welcome back!'));

        initWidget('loyalty', { ...loyaltySettings, template: welcomeText });
      }
    }).catch(() => {});
  }

  function initFlashSale(campaign) {
    if (campaign.status !== 'active') return;
    
    const now = new Date().getTime();
    if (now < new Date(campaign.startTime).getTime()) return;
    if (now > new Date(campaign.endTime).getTime()) return;

    // URL Filter
    if (!campaign.isGlobal && campaign.targetUrls?.length > 0) {
      if (!campaign.targetUrls.some(url => window.location.href.includes(url))) return;
    }

    const bubble = document.createElement('div');
    bubble.style.cssText = `
      position: fixed; bottom: 100px; right: 24px; z-index: 9999999;
      background: ${campaign.themeColor || '#ef4444'}; color: white;
      padding: 12px 24px; border-radius: 50px; font-family: Inter, system-ui, sans-serif;
      font-weight: 900; font-size: 13px; cursor: pointer;
      display: flex; align-items: center; gap: 10px;
      box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4);
      transition: all 0.5s; transform: translateX(120%);
    `;
    bubble.innerHTML = `<span>🔥</span> <span>${campaign.name.toUpperCase()} ĐANG CHẠY!</span> <span style="background:rgba(0,0,0,0.2);padding:4px 8px;border-radius:8px;font-size:10px">XEM</span>`;
    document.body.appendChild(bubble);
    setTimeout(() => {
      bubble.style.transform = 'translateX(0)';
      bubble.style.opacity = '1';
    }, 2000);

    bubble.onclick = () => showStore(campaign);
  }

  function showStore(campaign) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.98);backdrop-filter:blur(20px);z-index:10000000;display:flex;flex-direction:column;align-items:center;padding:60px 20px;overflow-y:auto;font-family:Inter, system-ui, sans-serif;color:white;`;
    
    overlay.innerHTML = `
      <button id="lp-close" style="position:absolute;top:20px;right:24px;background:none;border:none;color:white;font-size:40px;cursor:pointer;opacity:0.5">&times;</button>
      <div style="text-align:center;margin-bottom:40px">
        <div style="color:#ef4444;font-weight:900;letter-spacing:2px;font-size:12px">FLASH SALE KẾT THÚC SAU</div>
        <div id="lp-timer" style="font-size:32px;font-weight:900;margin-top:10px">00:00:00</div>
        <h2 style="font-size:42px;font-weight:900;margin:20px 0 10px">${campaign.name}</h2>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px;width:100%;max-width:1100px">
        ${campaign.products.map(p => `
          <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:24px;padding:24px;display:flex;flex-direction:column;transition:0.3s">
            <div style="width:100%;aspect-ratio:1;border-radius:16px;overflow:hidden;background:white;margin-bottom:15px">
              <img src="${p.image || ''}" style="width:100%;height:100%;object-fit:contain" />
            </div>
            <h3 style="font-size:18px;font-weight:700;margin-bottom:10px;height:44px;overflow:hidden">${p.name}</h3>
            <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:20px">
              <span style="font-size:24px;font-weight:900;color:#ef4444">${p.salePrice.toLocaleString()}đ</span>
              <span style="font-size:14px;text-decoration:line-through;opacity:0.4">${p.originalPrice.toLocaleString()}đ</span>
            </div>
            <button class="lp-buy" data-url="${p.url}" data-code="${p.discountCode || campaign.globalDiscountCode || ''}" style="width:100%;padding:14px;background:white;color:black;border:none;border-radius:12px;font-weight:900;cursor:pointer">CHỐT ĐƠN & COPY MÃ</button>
          </div>
        `).join('')}
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.querySelector('#lp-close').onclick = () => overlay.remove();
    overlay.querySelectorAll('.lp-buy').forEach(btn => {
      btn.onclick = () => {
        const code = btn.getAttribute('data-code');
        if (code) {
          navigator.clipboard.writeText(code);
          btn.innerText = 'ĐÃ COPY MÃ!';
          btn.style.background = '#22c55e';
          btn.style.color = 'white';
        }
        setTimeout(() => window.open(btn.getAttribute('data-url'), '_blank'), 800);
      };
    });

    const updateTimer = () => {
      const diff = new Date(campaign.endTime).getTime() - new Date().getTime();
      if (diff <= 0) return overlay.querySelector('#lp-timer').innerText = '00:00:00';
      const h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
      overlay.querySelector('#lp-timer').innerText = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    };
    setInterval(updateTimer, 1000); updateTimer();
  }

  function initWidget(type, settings) {
    if (!settings.enabled) return;

    // --- Bộ lọc URL ---
    if (settings.targetUrls) {
      const allowedUrls = settings.targetUrls.split('\n').map(u => u.trim()).filter(u => u);
      if (allowedUrls.length > 0) {
        const currentUrl = window.location.href;
        const isMatch = allowedUrls.some(url => currentUrl.includes(url));
        if (!isMatch) return; 
      }
    }

    const container = document.createElement('div');
    container.style.cssText = `opacity:0;transition:0.6s;z-index:999999;position:fixed;bottom:24px;right:24px;font-family:Inter, system-ui, sans-serif;`;
    
    const trackEvent = (evtType) => {
      fetch(`${baseUrl}/api/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: key, widgetType: type, eventType: evtType })
      }).catch(() => {});
    };

    const show = () => {
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
      trackEvent('view');
    };

    const updateContent = (data) => {
      container.style.padding = '12px 20px';
      container.style.borderRadius = '20px';
      container.style.background = settings.style === 'dark' ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.9)';
      container.style.color = settings.style === 'dark' ? '#fff' : '#000';
      container.style.backdropFilter = 'blur(10px)';
      container.style.border = '1px solid rgba(255,255,255,0.1)';
      container.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
      
      let content = '';
      if (type === 'viewers') content = `<span>👁️ ${settings.template.replace('{count}', data || 0)}</span>`;
      else if (type === 'purchases') content = `<span>🎓 ${strings.purchases[browserLang]} ${data?.productName || 'Product'}</span>`;
      else if (type === 'loyalty') content = `<span>👋 ${settings.template}</span>`;
      
      container.innerHTML = content;
    };

    document.body.appendChild(container);

    if (type === 'viewers') {
      const connect = () => {
        const socket = new WebSocket(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${baseUrl.replace(/^https?:\/\//, '')}/api/ws?key=${key}&page=${window.location.pathname}`);
        socket.onmessage = (e) => {
          const d = JSON.parse(e.data);
          if (d.type === 'update') { updateContent(d.count); setTimeout(show, settings.delay || 1000); }
        };
        socket.onclose = () => setTimeout(connect, 5000);
      };
      connect();
    } else if (type === 'purchases') {
      fetch(`${baseUrl}/api/purchases/latest?key=${key}`).then(res => res.json()).then(d => {
        if (d.purchases?.length > 0) { updateContent(d.purchases[0]); setTimeout(show, settings.delay || 1000); }
      });
    } else if (type === 'loyalty') {
      updateContent(); setTimeout(show, settings.delay || 1000);
    }
  }
})();
