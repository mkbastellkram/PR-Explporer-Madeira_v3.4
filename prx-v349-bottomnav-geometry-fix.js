/* PRX-FIX-V3.4.9 | Bottom Navigation Geometry Guard
   Einbindung: ganz am Ende von index.html, nach app.js und nach V3.4.8-Patch.
   Wirkung: erkennt die BottomNav, setzt kompakte Geometrie, repariert Leaflet nach Layoutänderung. */
(function () {
  'use strict';

  const PRX = window.PRX = window.PRX || {};
  const CORE = 86;
  const ITEM = 68;
  let installed = false;
  let observer = null;

  function ensureViewportMeta() {
    let meta = document.querySelector('meta[name="viewport"]');
    const value = 'width=device-width, initial-scale=1, viewport-fit=cover';
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = value;
      document.head.appendChild(meta);
    } else if (!/viewport-fit=cover/.test(meta.content)) {
      meta.content = value;
    }
  }

  function setVars() {
    const root = document.documentElement;
    root.style.setProperty('--prx-bottom-nav-core', CORE + 'px');
    root.style.setProperty('--prx-bottom-nav-total', `calc(${CORE}px + env(safe-area-inset-bottom, 0px))`);
    root.style.setProperty('--prx-bottom-nav-item-h', ITEM + 'px');
    // Kompatibilität: V3.4.8 nutzt noch --prx-bottom-nav-h.
    root.style.setProperty('--prx-bottom-nav-h', CORE + 'px');
    document.body && document.body.setAttribute('data-prx-v349', 'bottomnav-geometry');
  }

  function textOf(el) {
    return (el && el.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function findBottomNav() {
    const direct = document.querySelector('#bottomNav, .bottom-nav, .prx-bottom-nav, .tabbar, nav[aria-label="Hauptnavigation"]');
    if (direct) return direct;

    const candidates = Array.from(document.querySelectorAll('nav, footer, [role="tablist"], .tabs, .navigation, .nav'));
    return candidates.find((el) => {
      const t = textOf(el);
      return t.includes('karte') && t.includes('journal') && t.includes('reise') && t.includes('dashboard');
    }) || null;
  }

  function findMapViewport() {
    return document.getElementById('prxMapViewport') ||
           document.getElementById('mapViewport') ||
           document.querySelector('.map-viewport, .prx-map-viewport') ||
           null;
  }

  function findMapElement() {
    return document.getElementById('map') || document.querySelector('.leaflet-container, .map');
  }

  function applyInlineGeometry() {
    setVars();

    const nav = findBottomNav();
    if (nav) {
      nav.classList.add('prx-v349-bottomnav');
      nav.style.setProperty('position', 'fixed', 'important');
      nav.style.setProperty('left', '0', 'important');
      nav.style.setProperty('right', '0', 'important');
      nav.style.setProperty('bottom', '0', 'important');
      nav.style.setProperty('height', 'var(--prx-bottom-nav-total)', 'important');
      nav.style.setProperty('min-height', 'var(--prx-bottom-nav-total)', 'important');
      nav.style.setProperty('max-height', 'var(--prx-bottom-nav-total)', 'important');
      nav.style.setProperty('padding-top', '0', 'important');
      nav.style.setProperty('padding-bottom', 'env(safe-area-inset-bottom, 0px)', 'important');
      nav.style.setProperty('box-sizing', 'border-box', 'important');
      nav.style.setProperty('overflow', 'hidden', 'important');

      const items = nav.querySelectorAll('button, a, .nav-item, .bottom-nav-item, [role="tab"]');
      items.forEach((item) => {
        item.style.setProperty('height', 'var(--prx-bottom-nav-item-h)', 'important');
        item.style.setProperty('max-height', 'var(--prx-bottom-nav-item-h)', 'important');
        item.style.setProperty('min-height', '0', 'important');
        item.style.setProperty('padding-top', '6px', 'important');
        item.style.setProperty('padding-bottom', '6px', 'important');
        item.style.setProperty('margin-top', '0', 'important');
        item.style.setProperty('margin-bottom', '0', 'important');
        item.style.setProperty('box-sizing', 'border-box', 'important');
      });
    }

    const viewport = findMapViewport();
    if (viewport) {
      viewport.style.setProperty('position', 'absolute', 'important');
      viewport.style.setProperty('left', '0', 'important');
      viewport.style.setProperty('right', '0', 'important');
      viewport.style.setProperty('top', '0', 'important');
      viewport.style.setProperty('bottom', 'var(--prx-bottom-nav-total)', 'important');
      viewport.style.setProperty('height', 'auto', 'important');
      viewport.style.setProperty('overflow', 'hidden', 'important');
    }

    const mapEl = findMapElement();
    if (mapEl) {
      mapEl.style.setProperty('position', 'absolute', 'important');
      mapEl.style.setProperty('inset', '0', 'important');
      mapEl.style.setProperty('width', '100%', 'important');
      mapEl.style.setProperty('height', '100%', 'important');
    }
  }

  function collectLeafletMaps() {
    const maps = [];
    const seen = new Set();

    ['map', 'leafletMap', 'prxMap', 'PRX_MAP'].forEach((key) => {
      const obj = window[key];
      if (obj && typeof obj.invalidateSize === 'function' && !seen.has(obj)) {
        seen.add(obj); maps.push(obj);
      }
    });

    if (window.PRX) {
      Object.keys(window.PRX).forEach((key) => {
        const obj = window.PRX[key];
        if (obj && typeof obj.invalidateSize === 'function' && !seen.has(obj)) {
          seen.add(obj); maps.push(obj);
        }
      });
    }

    Object.keys(window).slice(0, 1000).forEach((key) => {
      try {
        const obj = window[key];
        if (obj && typeof obj.invalidateSize === 'function' && obj._container && !seen.has(obj)) {
          seen.add(obj); maps.push(obj);
        }
      } catch (_) {}
    });

    return maps;
  }

  function invalidate(reason) {
    applyInlineGeometry();
    const run = () => {
      collectLeafletMaps().forEach((m) => {
        try { m.invalidateSize({ animate: false, pan: false }); }
        catch (_) { try { m.invalidateSize(true); } catch (__) {} }
      });
      document.dispatchEvent(new CustomEvent('prx:v349-layout-repaired', { detail: { reason } }));
    };

    requestAnimationFrame(run);
    setTimeout(run, 80);
    setTimeout(run, 180);
    setTimeout(run, 420);
    setTimeout(run, 900);
  }

  function install() {
    if (installed) return;
    installed = true;
    ensureViewportMeta();
    applyInlineGeometry();

    ['resize', 'orientationchange', 'pageshow', 'visibilitychange'].forEach((evt) => {
      window.addEventListener(evt, () => invalidate(evt), { passive: true });
    });

    document.addEventListener('prx:introClosed', () => invalidate('introClosed'));
    document.addEventListener('prx:map-repaired', () => invalidate('v348-map-repaired'));
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (!t || !t.closest) return;
      if (t.closest('[data-prx-start], #startApp, #introStart, .intro-start, .start-button, .nav-item, .bottom-nav-item, [role="tab"]')) {
        setTimeout(() => invalidate('click'), 120);
      }
    }, true);

    if (window.ResizeObserver) {
      const nav = findBottomNav();
      if (nav) new ResizeObserver(() => invalidate('bottomnav-resize')).observe(nav);
    }

    observer = new MutationObserver(() => applyInlineGeometry());
    observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });

    setTimeout(() => invalidate('install-1'), 150);
    setTimeout(() => invalidate('install-2'), 600);
    setTimeout(() => invalidate('install-3'), 1400);
  }

  PRX.v349ApplyBottomNavGeometry = applyInlineGeometry;
  PRX.v349RepairLayout = invalidate;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }
})();
