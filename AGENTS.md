<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- Everything below is project-owned. Keep it OUTSIDE the markers above —
     `next dev` rewrites that block on every start. -->

# Abu Dhabi Geo-Intelligence — project rules

Source of truth for requirements and data is the sibling `reference/` folder
(17 files, not part of this repo). `reference/00_README_Master_Index.md` indexes them.

## The data rule (non-negotiable)

Every displayed number must carry a status — `official`, `calculated`,
`indicative`, `modeled`, `qualitative` or `unavailable` — plus a source and
reference year. See `lib/taxonomy.ts`.

- Only the emirate and the three region totals are `official` (SCAD, 2024).
- All 25 localities are `qualitative` planning profiles. There is **no** published
  district-level population or nationality count. Never synthesise one.
- Missing data renders as a *reason* ("Not published at district level"), never as
  `0` or `N/A`.
- Do not add a thematic layer, chart or metric the seed data cannot support.
  `UNAVAILABLE_LAYERS` in `lib/taxonomy.ts` lists the ones deliberately disabled.

## One canonical result set

`filterAreas()` in `lib/filter.ts` is the only place areas are filtered. The map
markers, match count, results directory and CSV export all consume its output, so
that `map features = directory rows = export rows` holds. Do not filter areas
anywhere else.

## Basemap tiles

`lib/map-style.ts` defaults to `https://tile.openstreetmap.org/...`, which the OSM
Tile Usage Policy permits only for light/development use. **Set
`NEXT_PUBLIC_TILE_URL` to a licensed provider (MapTiler, Stadia, Protomaps) or a
self-hosted endpoint before deploying.** Attribution must stay visible either way.

## Gotchas

- CSS import order in `app/layout.tsx` is load-bearing: `globals.css` →
  `maplibre-gl.css` → `map-overrides.css`. Vendor must beat Tailwind preflight;
  our tweaks must beat vendor. Verify with `next build`, not just `next dev`.
- `maplibre-gl` v6 is ESM with **named exports only** — there is no default export.
  `Map` is exported as `MapLibreMap` too; prefer that alias so it does not shadow
  the global `Map`.
- **Turbopack mis-compiles MapLibre's worker URL.** It rewrites MapLibre's
  `new URL(workerFile, import.meta.url)` to point at the main library instead of
  `maplibre-gl-worker.mjs`, so `new Worker(url, {type:'module'})` gets HTML back and
  the map silently never starts ("Failed to load module script … MIME type
  text/html"). Fixed by serving the worker from `public/maplibre/` and calling
  `setWorkerUrl()` — see `lib/map-style.ts` (`WORKER_URL`).
  `scripts/sync-maplibre-worker.mjs` runs on `postinstall` to keep that copy in
  step with the installed version; do not hand-edit `public/maplibre/`. If you
  upgrade `maplibre-gl`, re-run `npm run sync:map-worker` and re-check whether the
  override is still needed.
- The `dynamic(..., { ssr: false })` call for the map must stay inside a
  `'use client'` module (`components/map/map-shell.tsx`). From a Server Component
  it throws `BailoutToCSRError` (E394).
- `reference/14_website_seed_data.json` stores region centres as `[lat, lng]`;
  MapLibre wants `[lng, lat]`. `lib/data/emirate.ts` uses named `{lng, lat}`
  fields on purpose.
- Arabic copy in `lib/i18n.ts`, `lib/data/areas.ts` and `lib/data/segments.ts` is
  a working translation and still needs Arabic-reviewer sign-off — a release gate
  in `reference/11`.

## Verifying without a browser

`next dev` exposes an MCP server at `/_next/mcp`. `get_compilation_issues` builds
the module graph for every route (including the dynamic map chunk) and
`compile_route` warms a single route — both without a browser session.
