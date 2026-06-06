# PRX-V3.4.9 | Bottom Navigation Geometry Fix

## Zweck

Dieser Patch behebt nicht den Zoom, sondern die Grundgeometrie:

- Bottom Navigation wird kompakter.
- Kartenfläche endet direkt oberhalb der Bottom Navigation.
- Safe-Area unten wird nur einmal berücksichtigt.
- Leaflet wird nach der Layoutänderung mehrfach neu vermessen.
- Die spätere Karussell-/Sheet-Positionierung kann sich an `--prx-bottom-nav-total` orientieren.

## Dateien

- `prx-v349-bottomnav-geometry-fix.css`
- `prx-v349-bottomnav-geometry-fix.js`

## Einbau

Die CSS-Datei nach der bestehenden App-CSS und nach dem V3.4.8-CSS laden:

```html
<link rel="stylesheet" href="prx-v349-bottomnav-geometry-fix.css">
```

Die JS-Datei ganz am Ende der `index.html`, nach der bestehenden App-Logik und nach dem V3.4.8-Patch laden:

```html
<script src="prx-v349-bottomnav-geometry-fix.js"></script>
```

## Sollwerte

```css
--prx-bottom-nav-core: 86px;
--prx-bottom-nav-total: calc(86px + env(safe-area-inset-bottom));
--prx-bottom-nav-item-h: 68px;
```

## Prüfpunkte auf iPhone

1. Intro öffnen.
2. „Los geht’s“ antippen.
3. Bottom Navigation prüfen: kompakter Riegel, nicht mehr überhoch.
4. Karte muss bis direkt oberhalb der Bottom Navigation laufen.
5. Icons/Labels der Bottom Navigation müssen innerhalb des Riegels mittig sitzen.
6. Bei Drehung oder Rückkehr aus Journal/Reise/Dashboard darf die Karte nicht schrumpfen.

## Falls die Leiste noch zu hoch ist

In `prx-v349-bottomnav-geometry-fix.css` und JS `CORE` reduzieren:

- 86 px = komfortabel
- 80 px = kompakt
- 76 px = sehr kompakt

Empfohlene nächste Teststufe, falls noch zu viel Platz verschwendet wird: `80px`.

## Diagnose

Im Browser kann man manuell auslösen:

```js
PRX.v349RepairLayout('manual-test')
```

