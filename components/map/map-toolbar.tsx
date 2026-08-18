"use client";

import { formatNumber, t } from "@/lib/i18n";
import type { Lang } from "@/lib/taxonomy";

/**
 * Search, the live match count and CSV export, sitting directly above the map.
 *
 * These three used to live in the top bar. They belong here instead: all three
 * act on the query, and the query's result is what the map and the directory
 * below it show. Putting the control next to the thing it changes means the
 * count is read in the same glance as the markers it counts.
 *
 * `aria-live` on the count is required rather than decorative — `reference/09`
 * asks for a screen-reader announcement whenever the selection or data changes,
 * and this is the only running total of the active query. It moved with the
 * count; losing it in the move would have been a silent accessibility
 * regression.
 *
 * The input keeps `id="area-search"`, so the label association and anything
 * pointing at that id survive the relocation.
 */
export function MapToolbar({
  lang,
  searchValue,
  onSearchChange,
  onExport,
  exportDisabled,
  matchCount,
}: {
  lang: Lang;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onExport: () => void;
  exportDisabled: boolean;
  matchCount: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-hairline bg-surface px-4 py-2.5 lg:px-6">
      <div className="order-last w-full min-w-0 flex-1 sm:order-none sm:w-auto sm:max-w-sm">
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
            className="w-full rounded-md border border-hairline bg-raised px-3 py-1.5 pe-8 text-[12.5px] text-ink transition-colors placeholder:text-ink-faint focus:border-flare/70"
          />
          {searchValue.length > 0 && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label={t("clearSearch", lang)}
              className="absolute inset-y-0 end-0 grid w-8 place-items-center text-ink-muted hover:text-ink"
            >
              <span aria-hidden="true">✕</span>
            </button>
          )}
        </div>
      </div>

      <p
        className="me-auto whitespace-nowrap text-[11.5px] tabular-nums text-ink-muted"
        aria-live="polite"
      >
        <span className="font-semibold text-flare">{formatNumber(matchCount, lang)}</span>{" "}
        {t(matchCount === 1 ? "matchingArea" : "matchingAreas", lang)} ·{" "}
        {t("baseline", lang)}
      </p>

      <button
        type="button"
        onClick={onExport}
        disabled={exportDisabled}
        title={t("exportScope", lang)}
        className="min-h-9 shrink-0 rounded-md bg-flare px-3 py-1.5 text-[12px] font-semibold text-flare-ink transition-colors hover:bg-flare-amber disabled:cursor-not-allowed disabled:bg-raised disabled:text-ink-faint"
      >
        {t("exportCsv", lang)}
      </button>
    </div>
  );
}
