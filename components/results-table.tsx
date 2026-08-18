"use client";

import { ConfidenceBadge } from "@/components/confidence-badge";
import { ppFill, ppText } from "@/lib/colors";
import type { Area } from "@/lib/data/areas";
import { REFERENCE_YEAR } from "@/lib/data/emirate";
import { bi, formatNumber, t } from "@/lib/i18n";
import {
  CATEGORY_LABELS,
  LANGUAGE_LABELS,
  PP_LABELS,
  REGION_LABELS,
  SEGMENT_LABELS,
  type Lang,
} from "@/lib/taxonomy";

/**
 * The results directory (`reference/15 §5`).
 *
 * This is also the accessible alternative to the map that WCAG 2.2 AA and
 * `reference/09` require, which is why it is a real `<table>` with scoped
 * headers rather than a grid of cards — and why it consumes the very same
 * `filterAreas` output the markers do.
 */
export function ResultsTable({
  areas,
  lang,
  selectedId,
  onSelect,
  onReset,
  hasFilters,
}: {
  areas: readonly Area[];
  lang: Lang;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReset: () => void;
  hasFilters: boolean;
}) {
  return (
    <section aria-labelledby="directory-heading" className="bg-base">
      {/*
        The same `max-w-[1600px]` container as every other section, which this was
        missing — it ran full-bleed while the hero, signals, baseline and footer all
        sat on the shared measure, so the directory looked like it belonged to a
        different page. Panelled in `bg-surface` with a hairline so it reads as one
        object rather than as loose rows on the page ground.
      */}
      <div className="mx-auto w-full max-w-[1600px] px-4 pt-14 pb-16 lg:px-6">
        <div className="reveal-on-scroll overflow-hidden rounded-2xl border border-hairline bg-surface">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-4 pt-5 lg:px-6">
        <h2
          id="directory-heading"
          className="text-[11px] font-semibold uppercase tracking-[0.14em] text-flare"
        >
          {t("liveFilteredDirectory", lang)}{" "}
          <span className="font-normal tabular-nums text-ink-muted">
            ({formatNumber(areas.length, lang)})
          </span>
        </h2>
        <p className="text-[11px] text-ink-muted">{t("directoryNote", lang)}</p>
      </div>

      {areas.length === 0 ? (
        <div className="mx-4 my-4 rounded-xl border border-dashed border-hairline bg-raised px-4 py-8 text-center lg:mx-6">
          <p className="text-sm font-semibold text-ink">{t("noMatchesTitle", lang)}</p>
          <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-ink-muted">
            {t("noMatchesBody", lang)}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={onReset}
              className="mt-3 rounded-lg border border-hairline bg-surface px-3 py-2 text-xs font-semibold text-ink hover:border-uae-red hover:text-uae-red"
            >
              {t("resetAll", lang)}
            </button>
          )}
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto pb-1">
          <table className="w-full min-w-[62rem] border-collapse text-sm">
            <thead className="bg-raised text-start">
              <tr>
                {(
                  [
                    "colArea",
                    "colRegion",
                    "colCategory",
                    "colType",
                    "colLanguages",
                    "colSegments",
                    "colPp",
                    "colStatus",
                  ] as const
                ).map((key) => (
                  <th
                    key={key}
                    scope="col"
                    className="whitespace-nowrap px-3 py-2 text-start text-[11px] font-semibold uppercase tracking-wide text-ink-muted"
                  >
                    {t(key, lang)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => {
                const selected = selectedId === area.id;
                return (
                  <tr
                    key={area.id}
                    className={[
                      "border-t border-hairline align-top",
                      selected ? "bg-flare-tint" : "hover:bg-raised/60",
                    ].join(" ")}
                  >
                    <th scope="row" className="px-3 py-2 text-start font-normal">
                      <button
                        type="button"
                        onClick={() => onSelect(area.id)}
                        aria-pressed={selected}
                        className="text-start"
                      >
                        <span className="block font-semibold text-flare underline decoration-transparent hover:decoration-current">
                          {lang === "ar" ? area.nameAr : area.nameEn}
                        </span>
                        <span
                          className="block text-xs text-ink-muted"
                          dir={lang === "ar" ? "ltr" : "rtl"}
                        >
                          {lang === "ar" ? area.nameEn : area.nameAr}
                        </span>
                      </button>
                    </th>
                    <td className="px-3 py-2 text-xs text-ink">
                      {bi(REGION_LABELS[area.region], lang)}
                    </td>
                    <td className="px-3 py-2 text-xs text-ink">
                      {bi(CATEGORY_LABELS[area.category], lang)}
                    </td>
                    <td className="px-3 py-2 text-xs text-ink">
                      {bi(area.areaType, lang)}
                      <span className="block text-[11px] text-ink-muted">
                        {bi(area.densityProfile, lang)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-ink">
                      {area.languages.map((id) => bi(LANGUAGE_LABELS[id], lang)).join(", ")}
                    </td>
                    <td className="px-3 py-2 text-xs text-ink">
                      {area.segments.map((id) => bi(SEGMENT_LABELS[id], lang)).join(", ")}
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className="grid size-6 place-items-center rounded-full border-2 border-white text-[11px] font-bold shadow-sm"
                          style={{
                            backgroundColor: ppFill(area.pp),
                            color: ppText(area.pp),
                          }}
                        >
                          {area.pp}
                        </span>
                        <span className="text-xs text-ink">
                          {area.pp}/5 · {bi(PP_LABELS[area.pp], lang)}
                        </span>
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <ConfidenceBadge status={area.dataStatus} lang={lang} size="sm" />
                      <span className="mt-0.5 block text-[11px] tabular-nums text-ink-muted">
                        {REFERENCE_YEAR}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
        </div>
      </div>
    </section>
  );
}
