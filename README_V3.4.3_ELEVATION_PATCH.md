# PR-Explorer V3.4.3 · Elevation Patch

Dieser Patch integriert die im Projektordner vorhandenen GPX-Dateien aus `Gpx.zip` in die Höhenprofilanzeige.

## Korrektur

- GPX-Tracks werden mit Höhenwerten `[lat, lon, ele]` in `data.js` geführt, sofern die GPX-Datei `<ele>` enthält.
- `D.trackStats` enthält berechnete Track-Werte: Distanz, Min/Max-Höhe, Aufstieg, Abstieg, Quelle.
- Das Höhenprofil im Full-Sheet nutzt echte GPX-Elevation, sofern vorhanden.
- Wenn GPX keine Höhenwerte enthält, wird das klar als Stammdaten-/Fallback-Anzeige gekennzeichnet.

## Ergebnis

GPX-Dateien gefunden: 37  
Tracks mit echter Elevation: 35

## Test-URL

`index.html?v=3.4.3`
