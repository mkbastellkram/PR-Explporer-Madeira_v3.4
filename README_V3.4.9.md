# PRX V3.4.9 · iOS Viewport + Bottom-Nav Geometry Fix

## Ursachen des schwarzen Leerrauchs
1. html/body/app hatten height:100% (bricht auf iOS - kein definierter Parent)
2. #app hatte padding-bottom:env(safe-area-inset-bottom) → Safe-Area Reserve #1
3. .modebar hatte height:calc(62px + env(...)) → Reserve #2 in Höhe
4. .modebar hatte padding-bottom:calc(6px + env(...)) → Reserve #3 in Padding

## Lösung
- html,body: height:100dvh (dynamic viewport height - iOS-sicher)
- #app: position:fixed;inset:0;height:100dvh - kein padding-bottom
- --prx-nav-total: calc(62px + env(safe-area-inset-bottom)) als Root-Variable
- #map: bottom:var(--prx-nav-total) - endet exakt an Nav-Oberkante
- .modebar: height:var(--prx-nav-total), padding-bottom:env(...) nur einmal
- Alle Elemente (carousel, panels, toast, sheet) nutzen --prx-nav-total
- service-worker Cache auf v3-4-9 gebumpt → erzwingt Cache-Leerung
