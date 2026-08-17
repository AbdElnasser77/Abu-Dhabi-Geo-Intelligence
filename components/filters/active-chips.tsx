"use client";

import type { FilterPatch, Query } from "@/lib/filter";
import { bi, t } from "@/lib/i18n";
import {
  CATEGORY_LABELS,
  DENSITY_LABELS,
  LANGUAGE_LABELS,
  PP_LABELS,
  REGION_LABELS,
  SEGMENT_LABELS,
  type Lang,
} from "@/lib/taxonomy";

/**
 * Active-filter summary (`reference/01`: "show active-filter chips and a live
 * match count"). Also the summary that a print report needs, so it is NOT
 * inside a `print-hide` region.
 */
export function ActiveChips({
  lang,
  query,
  onToggle,
  onClearKeyword,
}: {
  lang: Lang;
  query: Query;
  onToggle: (patch: FilterPatch) => void;
  onClearKeyword: () => void;
}) {
  const chips: { key: string; label: string; remove: () => void }[] = [];

  const keyword = query.q.trim();
  if (keyword) {
    chips.push({
      key: `q:${keyword}`,
      label: `“${keyword}”`,
      remove: onClearKeyword,
    });
  }

  for (const value of query.regions) {
    chips.push({
      key: `region:${value}`,
      label: bi(REGION_LABELS[value], lang),
      remove: () => onToggle({ key: "regions", value }),
    });
  }
  for (const value of query.categories) {
    chips.push({
      key: `category:${value}`,
      label: bi(CATEGORY_LABELS[value], lang),
      remove: () => onToggle({ key: "categories", value }),
    });
  }
  for (const value of query.pp) {
    chips.push({
      key: `pp:${value}`,
      label: `${t("purchasingPower", lang)} ${value} · ${bi(PP_LABELS[value], lang)}`,
      remove: () => onToggle({ key: "pp", value }),
    });
  }
  for (const value of query.languages) {
    chips.push({
      key: `language:${value}`,
      label: bi(LANGUAGE_LABELS[value], lang),
      remove: () => onToggle({ key: "languages", value }),
    });
  }
  for (const value of query.segments) {
    chips.push({
      key: `segment:${value}`,
      label: bi(SEGMENT_LABELS[value], lang),
      remove: () => onToggle({ key: "segments", value }),
    });
  }
  for (const value of query.densities) {
    chips.push({
      key: `density:${value}`,
      label: `${t("density", lang)} · ${bi(DENSITY_LABELS[value], lang)}`,
      remove: () => onToggle({ key: "densities", value }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs font-medium text-ink-muted">
        {t("activeFilters", lang)}:
      </span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.remove}
          className="inline-flex items-center gap-1.5 rounded-full border border-deep-green/30 bg-pale-green px-2.5 py-1 text-xs font-medium text-deep-green hover:border-uae-red hover:text-uae-red print-hide"
        >
          {chip.label}
          <span aria-hidden="true">✕</span>
          <span className="sr-only">— {t("removeFilter", lang)}</span>
        </button>
      ))}
      {/* Print-only, non-interactive rendering of the same summary. */}
      <span className="hidden print:inline text-xs text-ink">
        {chips.map((chip) => chip.label).join(" · ")}
      </span>
    </div>
  );
}
