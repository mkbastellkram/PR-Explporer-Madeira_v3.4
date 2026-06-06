/* PRX-FIX-V3.4.8 | Leaflet Lazy Size Repair for iOS/PWA
   Einbindung: ganz am Ende von index.html, nach app.js.
   Wirkung: legt einen stabilen Kartencontainer an, misst BottomNav, repariert Leaflet-Größe mehrfach. */
(function () {
  'use strict';

  const PRX = window.PRX = window.PRX || {};
  let installed = false;

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

  function findBottomNav() {
    return document.querySelector('#bottomNav, .bottom-nav, .prx-bottom-nav, .tabbar, nav[aria-label="Hauptnavigation"], nav');
  }

  function findMapElement() {
    return document.getElementById('map') || document.querySelector('.leaflet-container, .map');
  }

  function ensureAppShell() {
    let shell = document.getElementById('appShell') || document.querySelector('.app-shell, .prx-app-shell, body > .app');
    if (!shell) {
      shell = document.createElement('div');
      shell.id = 'appShell';
      while (document.body.firstChild) shell.appendChild(document.body.firstChild);
      document.body.appendChild(shell);
    }
    return shell;
  }

  function ensureMapViewport() {
    const shell = ensureAppShell();
    const map = findMapElement();
    if (!map) return null;

    let viewport = document.getElementById('prxMapViewport');
    if (!viewport) {
      viewport = document.createElement('main');
      viewport.id = 'prxMapViewport';
      viewport.setAttribute('aria-label', 'PR Explorer Karte');
      shell.insertBefore(viewport, shell.firstChild);
    }

    if (map.parentElement !== viewport) {
      viewport.appendChild(map);
    }
    return viewport;
  }

  function measureBottomNav() {
    const nav = findBottomNav();
    const h = nav ? Math.ceil(nav.getBoundingClientRect().height || 112) : 112;
    document.documentElement.style.setProperty('--prx-bottom-nav-h', `${Math.max(h, 88)}px`);
  }

  function collectLeafletMaps() {
    const maps = [];
    const seen = new Set();

    // bekannte globale Namen
    ['map', 'leafletMap', 'prxMap', 'PRX_MAP'].forEach((key) => {
      const obj = window[key];
      if (obj && typeof obj.invalidateSize === 'function' && !seen.has(obj)) {
        seen.add(obj); maps.push(obj);
      }
    });

    // PRX-Namespace
    if (window.PRX) {
      Object.keys(window.PRX).forEach((key) => {
        const obj = window.PRX[key];
        if (obj && typeof obj.invalidateSize === 'function' && !seen.has(obj)) {
          seen.add(obj); maps.push(obj);
        }
      });
    }

    // globale Suche als Fallback, bewusst begrenzt
    Object.keys(window).slice(0, 800).forEach((key) => {
      try {
        const obj = window[key];
        if (obj && typeof obj.invalidateSize === 'function' && obj._container && !seen.has(obj)) {
          seen.add(obj); maps.push(obj);
        }
      } catch (_) {}
    });

    return maps;
  }

  function hardInvalidateMap(reason) {
    measureBottomNav();
    ensureMapViewport();

    const run = () => {
      const maps = collectLeafletMaps();
      maps.forEach((m) => {
        try { m.invalidateSize({ animate: false, pan: false }); } catch (_) {
          try { m.invalidateSize(true); } catch (__) {}
        }
      });
      document.dispatchEvent(new CustomEvent('prx:map-repaired', { detail: { reason, count: maps.length } }));
    };

    requestAnimationFrame(run);
    setTimeout(run, 80);
    setTimeout(run, 180);
    setTimeout(run, 360);
    setTimeout(run, 720);
    setTimeout(run, 1200);
  }

  function closeIntroAndRepair() {
    const intro = document.querySelector('#introOverlay, #prxIntro, .prx-intro-overlay');
    if (intro) {
      intro.classList.add('is-closing');
      intro.style.pointerEvents = 'none';
      setTimeout(() => {
        if (intro && intro.parentElement) intro.parentElement.removeChild(intro);
        hardInvalidateMap('intro-closed');
      }, 420);
    } else {
      hardInvalidateMap('manual-no-intro');
    }
  }

  function install() {
    if (installed) return;
    installed = true;
    ensureViewportMeta();
    ensureAppShell();
    ensureMapViewport();
    measureBottomNav();

    const nav = findBottomNav();
    if (window.ResizeObserver && nav) {
      new ResizeObserver(() => hardInvalidateMap('bottom-nav-resize')).observe(nav);
    }

    ['resize', 'orientationchange', 'pageshow', 'visibilitychange'].forEach((evt) => {
      window.addEventListener(evt, () => hardInvalidateMap(evt), { passive: true });
    });

    document.addEventListener('prx:introClosed', () => hardInvalidateMap('prx:introClosed'));
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (!t) return;
      const start = t.closest && t.closest('[data-prx-start], #startApp, #introStart, .intro-start, .start-button');
      if (start) setTimeout(() => hardInvalidateMap('start-button'), 120);
    }, true);

    setTimeout(() => hardInvalidateMap('install'), 250);
  }

  PRX.installFullscreenMapGuard = install;
  PRX.hardInvalidateMap = hardInvalidateMap;
  PRX.closeIntroAndRepair = closeIntroAndRepair;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }
})();
