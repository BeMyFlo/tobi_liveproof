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
      console.log('Tobi LiveProof: Widgets settings loaded', data);
      if (!data.widgets) return;
      
      // Initialize regular widgets (skip loyalty as it's handled by visitor tracking)
      Object.keys(data.widgets).forEach(type => {
        if (type !== 'loyalty') {
          initWidget(type, data.widgets[type]);
        }
      });

      // --- Visitor Tracking & Welcome Logic ---
      let visitorId = localStorage.getItem('lp_vid');
      if (!visitorId) {
        visitorId = 'vid_' + Math.random().toString(36).substring(2, 15) + Date.now();
        localStorage.setItem('lp_vid', visitorId);
        console.log('Tobi LiveProof: Assigned new visitorId', visitorId);
      }

  fetch(`${baseUrl}/api/track-visitor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, visitorId, url: window.location.href })
  }).then(res => res.json()).then(res => {
    const isNewSession = !sessionStorage.getItem('lp_session_seen');
    const loyaltySettings = data.widgets.loyalty || { enabled: false };
    
    if (isNewSession && res.isReturning && loyaltySettings.enabled) {
      sessionStorage.setItem('lp_session_seen', 'true'); // Mark session as greated immediately
      console.log('Tobi LiveProof: ✅ Triggering Welcome Widget!');
      
      const welcomeText = res.specialTrigger === 'LONG_TIME_NO_SEE' 
        ? (loyaltySettings.templateLong || strings.loyalty[browserLang]) 
        : (loyaltySettings.template || (browserLang === 'vi' ? 'Chào mừng bạn quay lại! Rất vui được gặp lại bạn.' : 'Welcome back! Great to see you again.'));

      initWidget('loyalty', { 
        ...loyaltySettings,
        enabled: true, 
        template: welcomeText,
        delay: loyaltySettings.delay || 1500
      });
    } else if (!isNewSession) {
      console.log('Tobi LiveProof: ✋ Welcome session skipped (already seen in this session)');
    }
  }).catch(err => console.error('Tobi LiveProof: Tracking error', err));
    });

  function initWidget(type, settings) {
    if (!settings.enabled) return;

    // --- 1. URL Filtering Check ---
    if (settings.targetUrls) {
      const allowedUrls = settings.targetUrls.split('\n').map(u => u.trim()).filter(u => u);
      if (allowedUrls.length > 0) {
        const currentUrl = window.location.href;
        const isMatch = allowedUrls.some(url => currentUrl.includes(url));
        if (!isMatch) return; // Silent stop for this widget on this page
      }
    }

    const container = document.createElement('div');
    container.id = `tlp-${type}-widget`;
    
    const isPopupType = type === 'exit-intent' || type === 'retention';
    const isPersistentType = type === 'scarcity';
    
    // --- 2. Determine Mount Point & Inline Status ---
    let mountPoint = document.body;
    let isInline = settings.position === 'inline';
    const targetSelector = settings.targetSelector;

    if (targetSelector && !isPopupType && !isPersistentType) {
      const targetEl = document.querySelector(targetSelector);
      if (targetEl) {
        mountPoint = targetEl;
        isInline = true;
      } else {
        return; // Target defined but not found on this page -> Don't show
      }
    }

    // --- 3. Initial Styling ---
    container.style.cssText = `
      opacity: 0;
      transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 9999999;
      position: ${isInline ? 'relative' : 'fixed'};
      pointer-events: auto;
      margin: ${isInline ? '10px 0' : '0'};
    `;

    if (!isInline) {
      if (isPopupType) {
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%) scale(0.95)';
      } else {
        const pos = settings.position || 'bottom-right';
        container.style.bottom = pos.includes('bottom') ? '24px' : 'auto';
        container.style.top = pos.includes('top') ? '24px' : 'auto';
        container.style.right = pos.includes('right') ? '24px' : 'auto';
        container.style.left = pos.includes('left') ? '24px' : 'auto';
        container.style.transform = 'translateY(20px)';
      }
    } else {
      container.style.width = 'fit-content';
    }

    const trackEvent = (evtType, meta = {}) => {
      fetch(`${baseUrl}/api/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: key, widgetType: type, eventType: evtType, metadata: meta })
      }).catch(() => {});
    };

    const applyTheme = (el) => {
      el.style.padding = type === 'exit-intent' ? '40px' : '12px 20px';
      el.style.borderRadius = '20px';
      el.style.fontSize = '14px';
      el.style.display = 'flex';
      el.style.flexDirection = isPopupType ? 'column' : 'row';
      el.style.alignItems = 'center';
      el.style.gap = '12px';
      el.style.boxShadow = isInline ? 'none' : '0 20px 40px -10px rgba(0,0,0,0.4)';
      el.style.fontFamily = 'Inter, system-ui, sans-serif';
      el.style.backdropFilter = 'blur(12px)';
      el.style.border = '1px solid rgba(255,255,255,0.1)';
      el.style.maxWidth = isPopupType ? '400px' : '340px';
      el.style.textAlign = 'center';

      if (settings.style === 'dark') {
        el.style.background = 'rgba(15, 23, 42, 0.9)';
        el.style.color = '#fff';
      } else {
        el.style.background = 'rgba(255, 255, 255, 0.9)';
        el.style.color = '#0f172a';
        el.style.border = '1px solid rgba(0,0,0,0.05)';
      }
    };

    const updateContent = (data) => {
      let html = '';
      if (type === 'viewers') {
        html = `<span>${settings.template.replace('{count}', data || 0)}</span>`;
      } else if (type === 'purchases') {
        const p = data || { productName: 'Product', customerLocation: 'Earth' };
        html = `<span style="font-size: 20px">🛒</span>
                <div style="text-align: left">
                  <div style="font-size: 11px; opacity: 0.6">${strings.purchases[browserLang]}</div>
                  <div style="font-weight: 800">${p.productName}</div>
                  <div style="font-size: 10px; opacity: 0.5">from ${p.customerLocation}</div>
                </div>`;
      } else if (type === 'loyalty') {
        html = `<span style="font-size: 20px">👋</span>
                <div style="text-align: left">
                  <div style="font-weight: 800">${settings.template}</div>
                </div>`;
      } else if (isPopupType) {
        const popupTitle = type === 'exit-intent' ? strings.exit[browserLang] : strings.stay[browserLang];
        html = `
          <div style="font-size: 32px">🎁</div>
          <h2 style="margin: 10px 0; font-weight: 900; line-height: 1.2">${popupTitle}</h2>
          <p style="margin-bottom: 20px; opacity: 0.8">${settings.template.replace('{code}', `<b style="color: #3b82f6">${settings.discountCode}</b>`)}</p>
          <button class="tlp-btn" style="width: 100%; padding: 14px; background: #3b82f6; color: white; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s">
            ${settings.discountMode === 'code' ? 'Copy Code' : (settings.discountMode === 'redirect' ? 'Claim Offer' : 'Get Discount')}
          </button>
          <button class="tlp-close" style="margin-top: 15px; background: none; border: none; color: inherit; opacity: 0.5; font-size: 12px; cursor: pointer; text-decoration: underline">No thanks</button>
        `;
      } else if (isPersistentType) {
        let count = 0;
        let foundManual = false;
        const currentUrl = window.location.href;
        if (settings.inventory) {
          const lines = settings.inventory.split('\n').filter(l => l.includes(':'));
          for (const line of lines) {
            const [slug, qty] = line.split(':');
            if (currentUrl.includes(slug.trim())) {
              count = parseInt(qty.trim()) || 0;
              foundManual = true;
              break;
            }
          }
        }
        if (!foundManual) {
          const urlHash = window.location.pathname.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
          count = Math.abs(urlHash % 5) + 2; 
        }
        let pName = document.title.split('-')[0].split('|')[0].trim();
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) pName = ogTitle.getAttribute('content').split('-')[0].split('|')[0].trim();

        html = `
          <div style="width: 45px; h-full flex items-center justify-center bg-orange-500/10 rounded-xl">
            <span style="font-size: 22px">⚠️</span>
          </div>
          <div style="flex: 1">
            <div style="font-weight: 800; color: #f97316">${settings.template.replace('{count}', count).replace('{product}', pName)}</div>
            <div style="font-size: 10px; opacity: 0.6">${strings.selling[browserLang]}</div>
          </div>`;
      }
      container.innerHTML = html;
      applyTheme(container);
      
      const btn = container.querySelector('.tlp-btn');
      if (btn) btn.onclick = () => {
        trackEvent('click', { mode: settings.discountMode });
        if (settings.discountMode === 'code') {
          navigator.clipboard.writeText(settings.discountCode);
          btn.innerText = strings.copied[browserLang];
        } else if (settings.discountMode === 'redirect') {
          window.location.href = settings.redirectUrl;
        }
      };
      
      const close = container.querySelector('.tlp-close');
      if (close) close.onclick = () => { container.style.display = 'none'; const over = document.getElementById('tlp-overlay'); if (over) over.remove(); };
    };

    const show = () => {
      container.style.opacity = '1';
      container.style.pointerEvents = 'auto';
      if (isPopupType) {
        container.style.transform = 'translate(-50%, -50%) scale(1)';
        if (!document.getElementById('tlp-overlay')) {
          const overlay = document.createElement('div');
          overlay.id = 'tlp-overlay';
          overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.73);z-index:9999998;opacity:0;transition:opacity 0.5s;';
          document.body.appendChild(overlay);
          setTimeout(() => overlay.style.opacity = '1', 10);
        }
      } else if (!isInline) {
        container.style.transform = 'translateY(0)';
      }
      trackEvent('view');
    };

    const hide = () => {
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';
      if (!isPopupType && !isInline) container.style.transform = 'translateY(20px)';
    };

    mountPoint.appendChild(container);

    // --- 4. Trigger Logic ---
    if (type === 'viewers') {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${baseUrl.replace('http:', '').replace('https:', '')}/api/ws?key=${key}&page=${window.location.pathname}`;
      let socket;
      const connect = () => {
        socket = new WebSocket(wsUrl);
        socket.onmessage = (e) => {
          const d = JSON.parse(e.data);
          if (d.type === 'update') {
            updateContent(d.count);
            setTimeout(show, settings.delay ?? 3000);
          }
        };
        socket.onclose = () => setTimeout(connect, 5000);
      };
      connect();
    } else if (type === 'purchases') {
      fetch(`${baseUrl}/api/purchases/latest?key=${key}`)
        .then(res => res.json())
        .then(d => {
          if (d.purchases && d.purchases.length > 0) {
            updateContent(d.purchases[0]);
            const delay = settings.delay ?? 3000;
            setTimeout(show, delay);
            if (settings.hideAfter) setTimeout(hide, delay + settings.hideAfter);
          }
        });
    } else if (type === 'exit-intent') {
      let shown = false;
      document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 0 && !shown) {
          shown = true;
          updateContent();
          setTimeout(show, settings.delay ?? 0);
        }
      });
    } else if (type === 'loyalty') {
      setTimeout(() => { updateContent(); show(); }, settings.delay ?? 1500);
      if (settings.hideAfter) setTimeout(hide, (settings.delay ?? 1500) + settings.hideAfter);
    } else if (type === 'retention') {
      setTimeout(() => { updateContent(); show(); }, settings.delay ?? 30000);
    } else if (type === 'scarcity') {
      const cycle = () => {
        updateContent();
        const delay = settings.delay ?? 5000;
        setTimeout(show, delay);
        setTimeout(() => { hide(); setTimeout(cycle, 10000); }, delay + (settings.hideAfter ?? 10000));
      };
      cycle();
    }
  }
})();
