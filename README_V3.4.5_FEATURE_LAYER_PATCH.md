# PR Explorer Madeira · V3.4.5 Feature-Layer-Patch

Schwerpunkt dieser Version:

- V3.4.4 Compliance-Stand beibehalten
- Tunnel als POI-/Feature-Kategorie ergänzt (`categoryId/baseIconId: tunnel`)
- Wasserfälle werden als Routenmerkmal-Layer behandelt
- Zähler in der Detailkarte: `Tunnel ≤100 m` und `Wasserfälle ≤100 m`
- Distanzprüfung gegen GPX-/KML-Geometrie vorbereitet
- Nur quellenbasierte/kuratierte Seed-Einträge; keine frei erfundenen OSM-Marker
- PR6.6 Túnel do Cavalo und PR16-Fajã-do-Rodrigues-Merkmale als verifizierungsbedürftige Seed-Features ergänzt
- POI-Piktogramme weiter von App-Bedienicons getrennt

Wichtige Einschränkung:

Der vollständige OSM-/Overpass-Import aller Tunnel-Ways und Wasserfall-Punkte ist noch nicht enthalten. V3.4.5 enthält die Zähl-/Darstellungslogik und Seed-Daten. Die vollständige OSM-Extraktion bleibt ein Admin-Datenpipeline-Schritt.

Test-URL:

`index.html?v=3.4.5`
