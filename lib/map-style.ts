/**
 * MapLibre style — a single OpenStreetMap raster basemap.
 *
 * IMPORTANT — tile provider. The default below is the public OSM tile server,
 * which the OpenStreetMap Tile Usage Policy limits to light and development use
 * and does not permit for high-volume or commercial products. Before this ships,
 * set `NEXT_PUBLIC_TILE_URL` to a licensed provider (MapTiler, Stadia,
 * Protomaps) or a self-hosted endpoint. Attribution must stay visible either
 * way — `reference/01` is explicit that "attribution and licensing must be
 * correct", and `reference/03`'s QA checklist requires it.
 *
 * No GeoJSON sources or fill layers are declared: the reference package contains
 * no boundary polygons, so there is nothing to fill. Localities are rendered as
 * HTML markers instead, which also means no `glyphs` URL is needed — MapLibre
 * only fetches glyphs for symbol layers, and avoiding them keeps Arabic label
 * shaping in the browser where it belongs (no CDN-loaded RTL text plugin).
 */

import type { StyleSpecification } from "maplibre-gl";

/**
 * Where we serve MapLibre's Web Worker from.
 *
 * WHY THIS EXISTS — Turbopack mis-compiles MapLibre v6's worker-URL lookup.
 * The original resolves the worker next to the library:
 *
 *   const file = import.meta.url.endsWith('-dev.mjs')
 *     ? 'maplibre-gl-worker-dev.mjs' : 'maplibre-gl-worker.mjs';
 *   return new URL(file, import.meta.url).href;
 *
 * Turbopack statically rewrites that `new URL(variable, import.meta.url)` and
 * points it at `maplibre-gl-dev.mjs` — the main library — discarding the
 * computed filename entirely. MapLibre then calls
 * `new Worker(wrongUrl, { type: 'module' })`, the request comes back as HTML,
 * and the browser reports:
 *
 *   "Failed to load module script: The server responded with a non-JavaScript
 *    MIME type of text/html."
 *
 * The map never starts. `setWorkerUrl()` is MapLibre's official override, so we
 * serve the worker from `public/maplibre/` and point at it explicitly.
 *
 * `maplibre-gl-worker.mjs` is a real ESM module that does
 * `import ... from "./maplibre-gl-shared.mjs"`, so BOTH files must sit together
 * in that folder. `scripts/sync-maplibre-worker.mjs` copies them out of
 * `node_modules` and runs on `postinstall`, which keeps them from drifting away
 * from the installed version.
 */
export const WORKER_URL = "/maplibre/maplibre-gl-worker.mjs";

export const DEFAULT_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export const TILE_URL = process.env.NEXT_PUBLIC_TILE_URL ?? DEFAULT_TILE_URL;

/** True when running on the shared OSM tile server rather than a licensed one. */
export const USING_PUBLIC_OSM_TILES = TILE_URL === DEFAULT_TILE_URL;

export const ATTRIBUTION =
  '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors';

export function buildStyle(): StyleSpecification {
  return {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: [TILE_URL],
        tileSize: 256,
        minzoom: 0,
        maxzoom: 19,
        attribution: ATTRIBUTION,
      },
    },
    layers: [
      {
        id: "osm-basemap",
        type: "raster",
        source: "osm",
      },
    ],
  };
}

/**
 * Zoom ceiling when fitting to matching markers. Without it, a single-result
 * query zooms to street level and loses all geographic context — which
 * `reference/03` warns against ("fit bounds to matching features with a maximum
 * zoom").
 */
export const MAX_FIT_ZOOM = 12;

export const FIT_PADDING = 72;

/** Zoom ceiling for the map overall — OSM raster has no tiles beyond 19. */
export const MAX_ZOOM = 18;
