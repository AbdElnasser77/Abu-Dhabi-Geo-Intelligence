"use client";

import { ConfidenceBadge } from "@/components/confidence-badge";
import { ppFill } from "@/lib/colors";
import { REFERENCE_YEAR, sourceById } from "@/lib/data/emirate";
import { EMIRATE_GROWTH_PERCENT, regionAggregate } from "@/lib/data/region-shapes";
import { bi, formatNumber, formatPercent, t } from "@/lib/i18n";
import {
  LANGUAGE_LABELS,
  PP_LABELS,
  SEGMENT_LABELS,
  type Lang,
  type PurchasingPower,
  type RegionId,
} from "@/lib/taxonomy";

/**
 * Region roll-up shown when a region outline is hovered or selected.
 *
 * Two kinds of number live here and they are labelled differently on purpose:
 *
 *  - Population and share are OFFICIAL SCAD figures and carry the official badge.
 *  - The purchasing-power score is DERIVED — the mean of this region's seed
 *    localities — and is labelled `modeled` with its range shown, because no
 *    region-level purchasing-power figure is published anywhere.
 *
 * And one number is deliberately missing. The reference implementation shows an
 * "annual growth" percentage per region; the reference package publishes growth
 * only for the emirate as a whole (SCAD 2024: +7.5%). Rather than invent a
 * regional rate, the emirate figure is shown and explicitly marked as such.
 */
export function RegionPanel({
  regionId,
  lang,
  isFiltered,
  onFilterToRegion,
  onClear,
  onDismiss,
}: {
  regionId: RegionId;
  lang: Lang;
  isFiltered: boolean;
  onFilterToRegion: () => void;
  onClear: () => void;
  /** The panel is opened by a click and stays put, so it needs a way out. */
  onDismiss: () => void;
}) {
  const agg = regionAggregate(regionId);
  const source = sourceById(agg.region.sourceId);
  const rounded = Math.round(agg.ppMean) as PurchasingPower;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-surface">
      <div className="border-b border-hairline p-5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] text-ink-muted" dir="rtl">
            {agg.region.name.ar}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <span className="inline-flex items-center gap-1 whitespace-nowrap text-[10px] font-medium text-flare">
              <span aria-hidden="true">✓</span>
              {t("officialBaseline", lang)}
            </span>
            <button
              type="button"
              onClick={onDismiss}
              aria-label={t("dismissRegion", lang)}
              className="grid size-7 place-items-center rounded-md border border-hairline text-ink-muted hover:border-uae-red hover:text-uae-red"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>
        </div>

        <h2 className="mt-1 text-2xl font-semibold leading-tight tracking-tight text-ink">
          {bi(agg.region.name, lang)}
        </h2>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-muted">
          {bi(agg.region.reading, lang)}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-hairline p-3">
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              {t("populationLabel", lang)}
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-ink">
              {formatNumber(agg.population, lang)}
            </p>
            <p className="text-[10.5px] text-ink-muted">
              {formatPercent(agg.share, lang)}% {t("shareOfEmirate", lang)}
            </p>
            <span className="mt-1.5 inline-block">
              <ConfidenceBadge status={agg.populationStatus} lang={lang} size="sm" />
            </span>
          </div>

          <div className="rounded-lg border border-hairline p-3">
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              {t("annualGrowth", lang)}
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-flare">
              +{formatPercent(EMIRATE_GROWTH_PERCENT, lang)}%
            </p>
            <p className="text-[10.5px] text-ink-muted">
              {t("emirateWide", lang)} · <span className="tabular-nums">{REFERENCE_YEAR}</span>
            </p>
            {/* The honest caveat: this is not a regional rate. */}
            <p className="mt-1 text-[10px] leading-snug text-ink-muted/80">
              {t("growthRegionUnavailable", lang)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <section>
          <p className="mb-1.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
            {t("purchasingPower", lang)}
          </p>
          <div className="flex items-center gap-2">
            <span className="flex gap-0.5" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((step) => (
                <span
                  key={step}
                  className="h-3 w-5 rounded-sm"
                  style={{
                    backgroundColor: step <= rounded ? ppFill(rounded) : "#E2DDD0",
                  }}
                />
              ))}
            </span>
            <span className="text-[13px] font-semibold tabular-nums text-ink">
              {rounded}/5
            </span>
            <span className="text-[11px] text-ink-muted">{bi(PP_LABELS[rounded], lang)}</span>
          </div>
          <p className="mt-1.5 text-[10.5px] leading-snug text-ink-muted">
            {t("derivedFromLocalities", lang)} ({agg.localityCount}{" "}
            {t("localitiesInRegion", lang)}) · {t("purchasingPower", lang)}{" "}
            {agg.ppMin}–{agg.ppMax}
          </p>
          {/* Derived, not published — badged accordingly. */}
          <span className="mt-1.5 inline-block">
            <ConfidenceBadge status="modeled" lang={lang} size="sm" />
          </span>
        </section>

        <section>
          <p className="mb-1.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
            {t("builtEnvironment", lang)}
          </p>
          <p className="text-[12px] leading-relaxed text-ink">
            {agg.builtForms.join(" · ")}
          </p>
        </section>

        <section>
          <p className="mb-1.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
            {t("languagePriority", lang)}
          </p>
          <ul className="flex flex-wrap gap-1">
            {agg.languages.map((id) => (
              <li
                key={id}
                className="rounded border border-hairline bg-raised px-1.5 py-0.5 text-[11px] text-ink"
              >
                {bi(LANGUAGE_LABELS[id], lang)}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <p className="mb-1.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
            {t("communityPriority", lang)}
          </p>
          <ul className="flex flex-wrap gap-1">
            {agg.segments.map((id) => (
              <li
                key={id}
                className="rounded border border-hairline bg-raised px-1.5 py-0.5 text-[11px] text-ink"
              >
                {bi(SEGMENT_LABELS[id], lang)}
              </li>
            ))}
          </ul>
        </section>

        <button
          type="button"
          onClick={isFiltered ? onClear : onFilterToRegion}
          className="bg-flare-gradient mt-1 flex min-h-11 w-full items-center justify-between gap-2 rounded-lg px-4 py-3 text-[13px] font-semibold text-flare-ink transition-opacity hover:opacity-90"
        >
          {isFiltered ? t("clearRegionFilter", lang) : t("filterToRegion", lang)}
          <span aria-hidden="true">{lang === "ar" ? "←" : "→"}</span>
        </button>

        <p className="text-[10.5px] text-ink-muted">
          {t("sourceLabel", lang)}:{" "}
          <a
            className="font-medium text-flare underline"
            href={source.url}
            target="_blank"
            rel="noreferrer"
          >
            {bi(source.publisher, lang)}
          </a>
        </p>
      </div>
    </div>
  );
}
