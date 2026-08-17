"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ActiveChips } from "@/components/filters/active-chips";
import { FilterRail } from "@/components/filters/filter-rail";
import { KpiStrip } from "@/components/kpi-strip";
import { MapShell } from "@/components/map/map-shell";
import { ProfileDrawer } from "@/components/profile-drawer";
import { RegionPanel } from "@/components/region-panel";
import { ResultsTable } from "@/components/results-table";
import { TopBar } from "@/components/top-bar";
import { downloadCsv } from "@/lib/csv";
import { areaById } from "@/lib/data/areas";
import { REFERENCE_YEAR, SOURCES } from "@/lib/data/emirate";
import {
  applyPatch,
  filterAreas,
  hasActiveFilters,
  soleRegion,
  type FilterPatch,
  type Query,
} from "@/lib/filter";
import { bi, dir, t } from "@/lib/i18n";
import {
  getterFromSearchParams,
  parseQuery,
  resetQuery,
  toHref,
} from "@/lib/query-state";
import type { Lang, RegionId, ThematicLayer } from "@/lib/taxonomy";

/**
 * State owner for the workspace.
 *
 * The URL is the single source of truth for the query. Deriving state from
 * `useSearchParams()` rather than mirroring it into React state means browser
 * back/forward works with no synchronisation code, and a shared link always
 * reproduces exactly what the sender saw — both required by `reference/15 §3`.
 *
 * Two different update mechanisms, on purpose:
 *  - filters and selection use `window.history.pushState`, the documented Next 16
 *    shallow-update path, which refreshes `useSearchParams` without a server
 *    round-trip;
 *  - the language toggle uses `router.push`, because `dir` and `metadata` are
 *    rendered on the server. The component tree is unchanged by that navigation,
 *    so the MapLibre instance survives it and map state is preserved — an
 *    explicit acceptance criterion in `reference/02`.
 */
export function Workspace({ initialQuery }: { initialQuery: Query }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = useMemo(
    () => parseQuery(getterFromSearchParams(searchParams)),
    [searchParams],
  );
  // `lang` comes from the server's parse of the same URL — the value the page
  // already used for `dir` — so the two can never disagree mid-render.
  const query = useMemo<Query>(
    () => ({ ...urlQuery, lang: initialQuery.lang }),
    [urlQuery, initialQuery.lang],
  );

  const results = useMemo(() => filterAreas(query), [query]);
  const visibleIds = useMemo(() => new Set(results.map((area) => area.id)), [results]);

  /**
   * The selection has to be reconciled against the result set here, in the render
   * path, and not only when a filter is toggled. `parseQuery` checks that
   * `?area=` names a real area but cannot know the filters — so a hand-edited or
   * shared link like `?area=mussafah&types=premium` would otherwise open a
   * profile for an area that has no visible marker and no directory row, which is
   * precisely the stale state `reference/15 §4` rules out.
   */
  const selectedId = query.area && visibleIds.has(query.area) ? query.area : null;
  const selected = areaById(selectedId);
  const region = soleRegion(query);
  const filtersActive = hasActiveFilters(query);
  const direction = dir(query.lang);
  const { lang } = query;

  // The search box is controlled locally so typing is never gated on the debounce.
  // `syncedFrom` records the URL value this text was last reconciled against, so
  // an external change — back/forward, a removed chip — is adopted during render
  // rather than through an effect that would cause a cascading re-render.
  const [search, setSearch] = useState({ text: query.q, syncedFrom: query.q });
  if (search.syncedFrom !== query.q) {
    setSearch({ text: query.q, syncedFrom: query.q });
  }
  const searchInput = search.text;

  const debounceRef = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(debounceRef.current), []);

  const [filtersOpen, setFiltersOpen] = useState(false);
  // The region outline the reader has clicked open. Local rather than URL state
  // because it is a reading focus, not a filter — the filter has its own `region`
  // param, and pinning a panel should not change which areas are in the results.
  const [pinnedRegion, setPinnedRegion] = useState<RegionId | null>(null);

  /**
   * Applies a transform to the *live* URL query and writes the result back.
   *
   * Reading the query from `window.location.search` rather than from a captured
   * variable means a debounced callback can never act on a stale snapshot, and
   * avoids mirroring props into a ref during render. `lang` round-trips through
   * the URL too, so nothing is lost.
   */
  const commit = useCallback(
    (build: (current: Query) => Query, mode: "push" | "replace" = "push") => {
      const current = parseQuery(
        getterFromSearchParams(new URLSearchParams(window.location.search)),
      );
      const next = build(current);

      // Keep selection coherent with the result set. A selected area that no
      // longer matches would leave the drawer open behind a hidden marker, and
      // reference/15 forbids showing stale results.
      const coherent =
        next.area && !filterAreas(next).some((area) => area.id === next.area)
          ? { ...next, area: null }
          : next;

      const href = toHref(coherent);
      if (mode === "push") window.history.pushState(null, "", href);
      else window.history.replaceState(null, "", href);
    },
    [],
  );

  const onToggle = useCallback(
    (patch: FilterPatch) => commit((current) => applyPatch(current, patch)),
    [commit],
  );

  const onToggleRegion = useCallback(
    (value: RegionId) => onToggle({ key: "regions", value }),
    [onToggle],
  );

  const onSearchChange = useCallback(
    (value: string) => {
      setSearch((previous) => ({ ...previous, text: value }));
      window.clearTimeout(debounceRef.current);
      // `replace` so a long query does not leave one history entry per keystroke.
      debounceRef.current = window.setTimeout(() => {
        commit((current) => ({ ...current, q: value }), "replace");
      }, 250);
    },
    [commit],
  );

  const onClearKeyword = useCallback(() => {
    window.clearTimeout(debounceRef.current);
    // Cleared explicitly rather than left to the URL round-trip: if `q` was
    // already empty in the URL there would be no change to reconcile against,
    // and typed-but-not-yet-committed text would survive the reset.
    setSearch({ text: "", syncedFrom: "" });
    commit((current) => ({ ...current, q: "" }));
  }, [commit]);

  const onSelect = useCallback(
    (id: string | null) => commit((current) => ({ ...current, area: id })),
    [commit],
  );

  const onLayerChange = useCallback(
    (layer: ThematicLayer) => commit((current) => ({ ...current, layer }), "replace"),
    [commit],
  );

  const onReset = useCallback(() => {
    window.clearTimeout(debounceRef.current);
    setSearch({ text: "", syncedFrom: "" });
    commit((current) => resetQuery(current));
  }, [commit]);

  const onToggleLang = useCallback(() => {
    const next: Lang = lang === "en" ? "ar" : "en";
    const current = parseQuery(
      getterFromSearchParams(new URLSearchParams(window.location.search)),
    );
    router.push(`${pathname}${toHref({ ...current, lang: next })}`, {
      scroll: false,
    });
  }, [lang, pathname, router]);

  const onExport = useCallback(() => downloadCsv(results, lang), [results, lang]);

  const onFilterToRegion = useCallback(
    (value: RegionId) => commit((current) => ({ ...current, regions: [value] })),
    [commit],
  );

  const onClearRegions = useCallback(
    () => commit((current) => ({ ...current, regions: [] })),
    [commit],
  );

  // Escape closes the drawer / deselects one level (reference/03 "Interactions").
  useEffect(() => {
    if (!selectedId && !pinnedRegion) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // One level at a time: the locality profile closes before the region panel.
      if (selectedId) commit((current) => ({ ...current, area: null }));
      else setPinnedRegion(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId, pinnedRegion, commit]);

  /*
   * The right column shows, in priority order: a selected locality profile, the
   * region clicked open on the map, or the single region currently filtered on —
   * so choosing a region from the KPI cards fills the panel too, which is also
   * how keyboard users reach it (a canvas polygon cannot take focus).
   */
  const panelRegion = pinnedRegion ?? region;
  const showPanel = Boolean(selected) || panelRegion !== null;
  const gridCols = showPanel
    ? "lg:grid-cols-[15rem_minmax(0,1fr)_20rem]"
    : "lg:grid-cols-[15rem_minmax(0,1fr)]";

  return (
    <>
      <a
        href="#map-pane"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold"
      >
        {t("skipToMap", lang)}
      </a>
      <a
        href="#results"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold"
      >
        {t("skipToResults", lang)}
      </a>

      <TopBar
        lang={lang}
        searchValue={searchInput}
        onSearchChange={onSearchChange}
        onToggleLang={onToggleLang}
        onExport={onExport}
        onToggleFilters={() => setFiltersOpen((open) => !open)}
        filtersOpen={filtersOpen}
        exportDisabled={results.length === 0}
        matchCount={results.length}
        contextRegion={panelRegion}
      />

      {/* The data rule from reference/00, stated once and prominently rather than
          buried in a methodology page the user may never open. */}
      <p className="border-b border-gold/40 bg-gold/10 px-4 py-2 text-xs leading-relaxed text-ink lg:px-6">
        {t("governanceBanner", lang)}
      </p>

      <KpiStrip
        lang={lang}
        selectedRegions={query.regions}
        onToggleRegion={onToggleRegion}
      />

      <main className="mx-auto w-full max-w-[1600px]">
        <div className={`lg:grid lg:items-start ${gridCols}`}>
          <aside
            id="filter-rail"
            aria-label={t("filters", lang)}
            className={[
              "border-b border-hairline bg-white lg:sticky lg:top-[4.25rem] lg:block lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto lg:border-b-0 lg:border-e print-hide",
              filtersOpen ? "block" : "hidden",
            ].join(" ")}
          >
            <FilterRail
              lang={lang}
              query={query}
              onToggle={onToggle}
              onReset={onReset}
              hasFilters={filtersActive}
              onLayerChange={onLayerChange}
            />
          </aside>

          <div id="map-pane" className="min-w-0">
            {filtersActive && (
              <div className="border-b border-hairline bg-white px-4 py-2">
                <ActiveChips
                  lang={lang}
                  query={query}
                  onToggle={onToggle}
                  onClearKeyword={onClearKeyword}
                />
              </div>
            )}
            <MapShell
              lang={lang}
              direction={direction}
              layer={query.layer}
              visibleIds={visibleIds}
              selectedId={selectedId}
              soleRegion={region}
              onSelect={onSelect}
              onRegionSelect={setPinnedRegion}
              matchCount={results.length}
            />
            {!showPanel && (
              <p className="px-4 py-2.5 text-[11px] text-ink-muted">
                {t("selectAreaPrompt", lang)} {t("hoverRegionHint", lang)}
              </p>
            )}
          </div>

          {showPanel && (
            /* Bottom sheet on small screens, third column on desktop. One
               instance either way, so tab state survives a resize. */
            <aside
              aria-label={selected ? t("directory", lang) : t("regionIntelligence", lang)}
              className="fixed inset-x-0 bottom-0 z-40 h-[60vh] overflow-hidden rounded-t-2xl border-t border-hairline bg-white shadow-2xl lg:sticky lg:inset-auto lg:top-[3.5rem] lg:z-auto lg:h-[calc(100vh-8.5rem)] lg:rounded-none lg:border-s lg:border-t-0 lg:shadow-none"
            >
              {selected ? (
                <ProfileDrawer area={selected} lang={lang} onClose={() => onSelect(null)} />
              ) : (
                panelRegion && (
                  <RegionPanel
                    regionId={panelRegion}
                    lang={lang}
                    isFiltered={query.regions.length === 1 && query.regions[0] === panelRegion}
                    onFilterToRegion={() => onFilterToRegion(panelRegion)}
                    onClear={onClearRegions}
                    onDismiss={() => {
                      setPinnedRegion(null);
                      if (region) onClearRegions();
                    }}
                  />
                )
              )}
            </aside>
          )}
        </div>
      </main>

      <div id="results" className="print-break-before">
        <ResultsTable
          areas={results}
          lang={lang}
          selectedId={selectedId}
          onSelect={onSelect}
          onReset={onReset}
          hasFilters={filtersActive}
        />
      </div>

      <footer className="mt-6 border-t border-hairline bg-white px-4 py-5 text-xs text-ink-muted lg:px-6">
        <p className="max-w-3xl leading-relaxed">{t("governanceBanner", lang)}</p>
        <p className="mt-2">
          {t("dataYear", lang)} <span className="tabular-nums">{REFERENCE_YEAR}</span> ·{" "}
          {t("sourceLabel", lang)}:{" "}
          {SOURCES.map((source, index) => (
            <span key={source.id}>
              {index > 0 && " · "}
              <a
                className="font-medium text-deep-green underline"
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                {bi(source.title, lang)}
              </a>
            </span>
          ))}
        </p>
        <p className="mt-2">
          {t("pointProfileNote", lang)} Basemap © OpenStreetMap contributors.
        </p>
      </footer>
    </>
  );
}
