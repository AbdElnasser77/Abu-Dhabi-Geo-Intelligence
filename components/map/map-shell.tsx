"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

import { bi, formatNumber, t } from "@/lib/i18n";
import { USING_PUBLIC_OSM_TILES } from "@/lib/map-style";
import { THEMATIC_LAYER_LABELS, type Lang, type RegionId, type ThematicLayer } from "@/lib/taxonomy";

/**
 * Client-only boundary for the map.
 *
 * `dynamic(..., { ssr: false })` MUST be called from a `'use client'` module —
 * Next 16 throws `BailoutToCSRError` (E394) if a Server Component does it. That
 * is the whole reason this file exists separately from `map-canvas.tsx`.
 *
 * This component also owns the map's failure states, which `reference/10`
 * requires: "Provide separate handling for basemap unavailable ... The tabular
 * explorer should remain usable when the map fails."
 */

const MapCanvas = dynamic(() => import("@/components/map/map-canvas"), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0 grid place-items-center bg-raised"
      role="status"
      aria-busy="true"
    >
      {/* Bilingual because a loading fallback receives no props to read `lang` from. */}
      <span className="animate-pulse text-sm text-ink-muted">
        Loading map… · جارٍ تحميل الخريطة…
      </span>
    </div>
  ),
});

/** How long to wait before telling the reader the chunk has not arrived. */
const SLOW_AFTER_MS = 12_000;

export function MapShell({
  lang,
  direction,
  layer,
  visibleIds,
  selectedId,
  soleRegion,
  onSelect,
  onRegionSelect,
  matchCount,
}: {
  lang: Lang;
  direction: "ltr" | "rtl";
  layer: ThematicLayer;
  visibleIds: ReadonlySet<string>;
  selectedId: string | null;
  soleRegion: RegionId | null;
  onSelect: (id: string | null) => void;
  onRegionSelect: (region: RegionId | null) => void;
  matchCount: number;
}) {
  const [ready, setReady] = useState(false);
  const [failure, setFailure] = useState<{ detail: string; webgl: boolean } | null>(null);
  const [tileTrouble, setTileTrouble] = useState(false);
  // reference/15 §4 lets the map's feature count differ from the directory row
  // count ONLY for "declared marker clustering at low zoom". This is the
  // declaration — without it the two counts would silently disagree.
  const [clusters, setClusters] = useState({ groupedAreas: 0, clusterCount: 0 });
  const [slow, setSlow] = useState(false);
  // Bumping this remounts the canvas, which is what "retry" has to do — a failed
  // MapLibre instance cannot be revived in place.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (ready || failure) return;
    const timer = window.setTimeout(() => setSlow(true), SLOW_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, [ready, failure, attempt]);

  const onReady = useCallback(() => {
    setReady(true);
    setSlow(false);
  }, []);

  const onError = useCallback((detail: string, kind: "webgl" | "construct") => {
    setFailure({ detail, webgl: kind === "webgl" });
  }, []);

  const onTileTrouble = useCallback(() => setTileTrouble(true), []);

  const onClusterInfo = useCallback(
    (groupedAreas: number, clusterCount: number) =>
      // Same value on most camera frames — bail early so panning does not
      // re-render the shell 60 times a second.
      setClusters((previous) =>
        previous.groupedAreas === groupedAreas && previous.clusterCount === clusterCount
          ? previous
          : { groupedAreas, clusterCount },
      ),
    [],
  );

  const retry = useCallback(() => {
    setFailure(null);
    setTileTrouble(false);
    setSlow(false);
    setReady(false);
    setAttempt((n) => n + 1);
  }, []);

  return (
    <div className="flex min-w-0 flex-col lg:min-h-0 lg:flex-1">
      {/*
        On `lg` and up the map takes whatever the workspace column has left, so it
        cannot push the block past one screen. Below that it keeps an explicit
        height, because in a stacked layout there is no leftover to fill.
      */}
      <div className="relative h-[62svh] min-h-[340px] overflow-hidden bg-raised lg:h-auto lg:min-h-0 lg:flex-1">
        {!failure && (
          <MapCanvas
            key={attempt}
            lang={lang}
            direction={direction}
            layer={layer}
            visibleIds={visibleIds}
            selectedId={selectedId}
            soleRegion={soleRegion}
            onSelect={onSelect}
            onReady={onReady}
            onError={onError}
            onTileTrouble={onTileTrouble}
            onClusterInfo={onClusterInfo}
            onRegionSelect={onRegionSelect}
          />
        )}

        {failure && (
          <div className="absolute inset-0 grid place-items-center overflow-y-auto bg-raised p-6">
            <div className="max-w-lg text-center">
              <h3 className="text-base font-semibold text-ink">{t("mapErrorTitle", lang)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink">
                {failure.webgl ? t("mapWebglMissing", lang) : t("mapErrorFallback", lang)}
              </p>
              {failure.webgl && (
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {t("mapErrorFallback", lang)}
                </p>
              )}
              {failure.detail && (
                <p className="mt-3 break-words rounded-md bg-surface px-3 py-2 text-start font-mono text-[11px] text-ink-muted">
                  <span className="font-sans font-semibold">{t("mapErrorDetail", lang)}: </span>
                  {failure.detail}
                </p>
              )}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={retry}
                  className="min-h-11 rounded-lg bg-flare px-4 py-2 text-sm font-semibold text-flare-ink transition-colors hover:bg-flare-amber"
                >
                  {t("mapRetry", lang)}
                </button>
                <a
                  href="#results"
                  className="min-h-11 rounded-lg border border-hairline bg-surface px-4 py-2 text-sm font-semibold text-ink hover:border-flare/60"
                >
                  {t("skipToResults", lang)}
                </a>
              </div>
            </div>
          </div>
        )}

        {!failure && !ready && slow && (
          <div className="absolute inset-x-0 top-0 z-10 border-b border-gold/40 bg-gold/15 px-4 py-2 text-xs text-ink">
            <strong className="font-semibold">{t("mapSlowTitle", lang)}.</strong>{" "}
            {t("mapSlowBody", lang)}
          </div>
        )}

        {/* Active-layer chip, bottom inline-start — mirrors under RTL. */}
        {!failure && (
          <div className="pointer-events-none absolute bottom-3 start-3 z-10 flex flex-col items-start gap-2">
            <span className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/90 px-3 py-1.5 text-[11px] font-medium text-ink shadow-sm backdrop-blur">
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-flare"
              />
              {bi(THEMATIC_LAYER_LABELS[layer], lang)} {t("activeLayer", lang)} ·{" "}
              <span className="tabular-nums">{formatNumber(matchCount, lang)}</span>{" "}
              {t("filteredAreas", lang)}
            </span>
            {clusters.clusterCount > 0 && (
              <span
                className="pointer-events-auto inline-flex rounded-full border border-hairline bg-surface/90 px-3 py-1.5 text-[11px] text-ink-muted shadow-sm backdrop-blur"
                role="status"
              >
                <span className="font-semibold text-ink">{clusters.groupedAreas}</span>
                &nbsp;{t("areasGrouped", lang)} · {t("zoomToSeparate", lang)}
              </span>
            )}
          </div>
        )}

        {/* Permanent statement of what the dashed outlines are and are not. */}
        {!failure && (
          <p
            className="pointer-events-auto absolute bottom-9 end-3 z-10 max-w-[19rem] rounded-md border border-hairline bg-surface/90 px-2.5 py-1.5 text-[10.5px] leading-snug text-ink-muted shadow-lg backdrop-blur"
            title={t("boundaryExplain", lang)}
          >
            {t("boundaryNote", lang)}
          </p>
        )}
      </div>

      {tileTrouble && !failure && (
        <p
          className="border-t border-gold/40 bg-gold/10 px-4 py-2 text-[11px] text-ink"
          role="status"
        >
          {t("mapTilesFailed", lang)}
        </p>
      )}

      <p className="border-t border-hairline bg-surface px-4 py-2 text-[10.5px] leading-snug text-ink-muted">
        {t("pointProfileNote", lang)} {t("boundaryExplain", lang)}
        {process.env.NODE_ENV !== "production" && USING_PUBLIC_OSM_TILES && (
          <span className="ms-1 font-medium text-uae-red">
            Development tile endpoint — set NEXT_PUBLIC_TILE_URL to a licensed
            provider before deploying.
          </span>
        )}
      </p>
    </div>
  );
}
