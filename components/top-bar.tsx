"use client";

import { REFERENCE_YEAR } from "@/lib/data/emirate";
import { bi, formatNumber, t } from "@/lib/i18n";
import { REGION_LABELS, type Lang, type RegionId } from "@/lib/taxonomy";

/**
 * Sticky top navigation (`reference/01` "Dashboard layout", item 1), styled to
 * match the reference implementation: a dark emerald band with the wordmark in
 * caps, the current geographic context beneath it, and the live match count and
 * data-year baseline on the far side.
 *
 * The data year is a label rather than the selector the spec sketches, because
 * 2024 is the only reference year in the dataset — a dropdown with one option
 * implies time-series capability that does not exist yet.
 */
export function TopBar({
  lang,
  searchValue,
  onSearchChange,
  onToggleLang,
  onExport,
  onToggleFilters,
  filtersOpen,
  exportDisabled,
  matchCount,
  contextRegion,
}: {
  lang: Lang;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onToggleLang: () => void;
  onExport: () => void;
  onToggleFilters: () => void;
  filtersOpen: boolean;
  exportDisabled: boolean;
  matchCount: number;
  contextRegion: RegionId | null;
}) {
  return (
    <header className="sticky top-0 z-30 bg-[#0C1F17] text-white print-hide">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 lg:px-6">
        <div className="me-auto min-w-0">
          {/* Not an <h1>: the hero above now owns the page heading, and two h1s
              on one document is a real problem for screen-reader navigation.
              Visually identical — this is the sticky wordmark, not a title. */}
          <p className="truncate text-[13px] font-bold uppercase tracking-[0.16em]">
            {t("brand", lang)}
          </p>
          <p className="truncate text-[11px] text-white/55">
            {contextRegion ? bi(REGION_LABELS[contextRegion], lang) : t("emirate", lang)}
          </p>
        </div>

        <div className="order-last w-full min-w-0 flex-1 sm:order-none sm:w-auto sm:max-w-xs">
          <label className="sr-only" htmlFor="area-search">
            {t("search", lang)}
          </label>
          <div className="relative">
            <input
              id="area-search"
              type="search"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={t("searchPlaceholder", lang)}
              className="w-full rounded-md border border-white/15 bg-white/10 px-3 py-1.5 pe-8 text-[12.5px] text-white placeholder:text-white/45 focus:border-white/40"
            />
            {searchValue.length > 0 && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label={t("clearSearch", lang)}
                className="absolute inset-y-0 end-0 grid w-8 place-items-center text-white/60 hover:text-white"
              >
                <span aria-hidden="true">✕</span>
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleFilters}
          aria-expanded={filtersOpen}
          aria-controls="filter-rail"
          className="min-h-9 rounded-md border border-white/20 px-2.5 py-1.5 text-[12px] font-medium hover:border-white/50 lg:hidden"
        >
          {filtersOpen ? t("hideFilters", lang) : t("showFilters", lang)}
        </button>

        {/*
          aria-live is required here, not decorative: `reference/09` asks for a
          screen-reader announcement whenever the selection or data changes, and
          this count is the only running total of the active query.
        */}
        <p
          className="whitespace-nowrap text-[11.5px] tabular-nums text-white/70"
          aria-live="polite"
        >
          <span className="font-semibold text-white">{formatNumber(matchCount, lang)}</span>{" "}
          {t("matchingAreas", lang)} · {t("baseline", lang)}
        </p>

        <button
          type="button"
          onClick={onToggleLang}
          aria-label={t("languageSwitch", lang)}
          className="min-h-9 rounded-md border border-white/20 px-2.5 py-1.5 text-[12px] font-semibold hover:border-white/50"
        >
          {lang === "en" ? t("switchToArabic", "ar") : t("switchToEnglish", "en")}
        </button>

        <button
          type="button"
          onClick={onExport}
          disabled={exportDisabled}
          title={t("exportScope", lang)}
          className="min-h-9 rounded-md bg-emerald-brand px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-white hover:text-deep-green disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/40"
        >
          {t("exportCsv", lang)}
        </button>

        <span className="sr-only">
          {t("dataYear", lang)} {REFERENCE_YEAR}
        </span>
      </div>
    </header>
  );
}
