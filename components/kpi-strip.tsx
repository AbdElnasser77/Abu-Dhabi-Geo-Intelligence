"use client";

import { ConfidenceBadge } from "@/components/confidence-badge";
import {
  EMIRATE,
  HEADLINE_METRICS,
  REGIONS,
  REFERENCE_YEAR,
  sourceById,
  type HeadlineMetric,
} from "@/lib/data/emirate";
import { bi, formatNumber, formatPercent, t } from "@/lib/i18n";
import type { Lang, RegionId } from "@/lib/taxonomy";

/**
 * Formats a headline figure with its unit. `~` is prepended where reference/05
 * marks the value as a rounded headline rather than an exact published count —
 * presenting "84%" as precise would overstate what SCAD published.
 */
function metricValue(metric: HeadlineMetric, lang: Lang): string {
  const prefix = metric.approximate ? "~" : "";
  switch (metric.unit) {
    case "percent":
      return `${prefix}${formatPercent(metric.value, lang)}%`;
    case "years":
      return `${prefix}${formatNumber(metric.value, lang)} ${t("unitYears", lang)}`;
    case "units":
      return `${prefix}${formatNumber(metric.value, lang)} ${t("unitUnits", lang)}`;
    default:
      return `${prefix}${formatNumber(metric.value, lang)}`;
  }
}

/**
 * The only official figures in the product: emirate total plus the three
 * statistical region totals (`reference/05`).
 *
 * Region cards double as the region filter — `reference/02` requires that
 * selecting a region fits its geographic bounds, so these are buttons rather
 * than static tiles.
 */
export function KpiStrip({
  lang,
  selectedRegions,
  onToggleRegion,
}: {
  lang: Lang;
  selectedRegions: readonly RegionId[];
  onToggleRegion: (region: RegionId) => void;
}) {
  const source = sourceById(EMIRATE.sourceId);

  return (
    <section
      aria-label={t("emirateTotal", lang)}
      className="border-b border-hairline bg-surface"
    >
      <div className="mx-auto grid w-full max-w-[1600px] gap-3 px-4 py-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        {/* The one gradient fill outside the hero. This is the only `official`
            emirate-wide figure on the page, so it gets the accent and everything
            else in the row stays a neutral card — see the note on
            `bg-flare-gradient` in globals.css. */}
        <div className="bg-flare-gradient rounded-xl px-4 py-3 text-flare-ink">
          <div className="text-xs font-medium tracking-wide text-flare-ink/80">
            {t("emirateTotal", lang)} · {REFERENCE_YEAR}
          </div>
          <div className="mt-1 text-3xl font-semibold tabular-nums">
            {formatNumber(EMIRATE.population, lang)}
          </div>
          <div className="mt-1 text-sm text-flare-ink/85">{bi(EMIRATE.name, lang)}</div>
          <a
            className="mt-2 inline-block text-xs text-flare-ink/90 underline decoration-flare-ink/40 hover:decoration-flare-ink"
            href={source.url}
            target="_blank"
            rel="noreferrer"
          >
            {bi(source.publisher, lang)}
          </a>
        </div>

        {REGIONS.map((region) => {
          const active = selectedRegions.includes(region.id);
          return (
            <button
              key={region.id}
              type="button"
              onClick={() => onToggleRegion(region.id)}
              aria-pressed={active}
              className={[
                "rounded-xl border px-4 py-3 text-start transition-colors",
                active
                  ? "border-flare bg-flare-tint ring-2 ring-flare"
                  : "border-hairline bg-surface hover:border-flare/60 hover:bg-flare-tint/60",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold text-ink">
                  {bi(region.name, lang)}
                </span>
                <ConfidenceBadge status={region.status} lang={lang} size="sm" />
              </div>
              <div className="mt-1 text-2xl font-semibold tabular-nums text-ink">
                {formatNumber(region.population, lang)}
              </div>
              <div className="text-xs text-ink-muted">
                {formatPercent(region.share, lang)}% {t("shareOfEmirate", lang)}
              </div>
              <p className="mt-1.5 text-xs leading-snug text-ink-muted">
                {bi(region.reading, lang)}
              </p>
            </button>
          );
        })}
      </div>

      {/*
        The ten official emirate-level figures from reference/05. Collapsed by
        default so the four headline cards stay the focus, but present — these are
        published SCAD statistics and were otherwise loaded and never shown.
      */}
      <div className="mx-auto w-full max-w-[1600px] px-4 pb-4 lg:px-6">
        <details className="rounded-lg border border-hairline bg-raised/60">
          <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-ink">
            {t("emirateDemographics", lang)} · {REFERENCE_YEAR}
          </summary>
          <dl className="grid gap-x-6 gap-y-2 px-3 pb-3 sm:grid-cols-2 lg:grid-cols-3">
            {HEADLINE_METRICS.map((metric) => (
              <div
                key={metric.key}
                className="flex items-baseline justify-between gap-2 border-b border-hairline/60 pb-1"
              >
                <dt className="text-xs text-ink-muted">
                  {bi(metric.label, lang)}
                  {metric.approximate && (
                    <span className="sr-only"> — {t("roundedHeadline", lang)}</span>
                  )}
                </dt>
                <dd className="flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold tabular-nums text-ink">
                  {metricValue(metric, lang)}
                  <ConfidenceBadge status={metric.status} lang={lang} size="sm" />
                </dd>
              </div>
            ))}
          </dl>
          <p className="px-3 pb-3 text-[11px] text-ink-muted">
            {t("sourceLabel", lang)}:{" "}
            <a
              className="font-medium text-flare underline"
              href={source.url}
              target="_blank"
              rel="noreferrer"
            >
              {bi(source.title, lang)}
            </a>
          </p>
        </details>
      </div>
    </section>
  );
}
