# PR Explorer Madeira · V3.4.4 Compliance Patch

## Zweck

Dieser Patch führt die Interview-Vereinbarungen konsequenter zusammen:

- POI-Seed-Datensatz mit 35 kuratierten Einträgen
- Kategorien: Parkplätze, Sehenswürdigkeiten, Cafés, Restaurants, Tankstellen, Strände/Küste, Aussichtspunkte, Wasserfälle, Wald/Trailheads
- deutsche Kurztexte bis max. 150 Zeichen
- Quelle / Maps-Link / Vertrauensgrad je POI
- Thumbnail-Logik: echtes Bildfeld vorbereitet; aktuell harter Icon-Fallback je Kategorie
- POI-Zuordnung über relatedPrIds statt blind globale Nächstsuche
- POI-Kontext nur beim aktiven PR
- Marker erst nach Auswahl
- Cupertino-orientierte App-Bedienicons per CSS
- harte PRX-Piktogramme für POI-Kategorien
- V3.4.3 Elevation-Fix bleibt enthalten

## Wichtige Einschränkung

Für Thumbnails werden in diesem Patch keine ungeprüften Fremdbilder hotlinked. `thumbnailUrl` ist vorbereitet. Wenn keine belastbare Bildquelle mit Lizenz/Attribution vorliegt, wird ein kategoriebasiertes Icon-Thumbnail verwendet.

## Upload

In den GitHub-Unterordner hochladen und vorhandene Dateien ersetzen.

Test-URL:

`index.html?v=3.4.4`
