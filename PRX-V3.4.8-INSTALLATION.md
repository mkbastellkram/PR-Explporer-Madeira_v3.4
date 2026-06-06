# PRX-FIX-V3.4.8 · Fullscreen Container + Leaflet Repair

## Ziel
Das Intro darf nicht mehr dazu führen, dass Leaflet nach dem Start in einem zu kleinen Viewport rendert.
Die App bekommt deshalb einen festen Karten-Slot `#prxMapViewport`; das Intro liegt nur noch darüber.

## Dateien
- `prx-v348-fullscreen-container-patch.css`
- `prx-v348-fullscreen-container-patch.js`

## Einbau in `index.html`

Im `<head>` prüfen/setzen:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="stylesheet" href="prx-v348-fullscreen-container-patch.css">
```

Am Ende von `<body>`, **nach** der bestehenden App-JS:

```html
<script src="prx-v348-fullscreen-container-patch.js"></script>
```

## Wichtiger Strukturhinweis
Optimal ist diese Grundstruktur:

```html
<div id="appShell">
  <main id="prxMapViewport">
    <div id="map"></div>
  </main>

  <!-- bestehende Top-Chips / Layer / Controls -->
  <!-- bestehende BottomNav -->

  <section id="prxIntro">...</section>
</div>
```

Das Patch-Script kann `#map` zur Not automatisch in `#prxMapViewport` verschieben.
Sauberer ist es aber, die Struktur direkt so anzulegen.

## Wenn dein Startbutton anders heißt
Der Patch reagiert automatisch auf:

- `[data-prx-start]`
- `#startApp`
- `#introStart`
- `.intro-start`
- `.start-button`

Der beste Weg ist, dem Intro-Startbutton dieses Attribut zu geben:

```html
<button data-prx-start>Los geht's</button>
```

## Manuelles Reparieren der Karte
Falls nach einem Tabwechsel die Karte erneut falsch sitzt:

```js
window.PRX.hardInvalidateMap('tab-return');
```

Das sollte beim Wechsel zurück auf „Karte“ aufgerufen werden.

## Test auf iPhone
1. GitHub Pages öffnen.
2. Startscreen anzeigen lassen.
3. Startbutton antippen.
4. Prüfen, ob die Karte bis an BottomNav und Displaykante reicht.
5. iPhone drehen und zurückdrehen.
6. Zur Journal-/Reise-Ansicht wechseln und zurück zur Karte.
7. Karte muss immer wieder vollflächig sitzen.
