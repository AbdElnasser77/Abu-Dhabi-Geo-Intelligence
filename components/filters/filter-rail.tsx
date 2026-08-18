"use client";

import { CATEGORY_COLORS, ppFill, ppText } from "@/lib/colors";
import { IntelligenceLayerRail, Legend } from "@/components/map/legend";
import type { FilterPatch, Query } from "@/lib/filter";
import { bi, t } from "@/lib/i18n";
import {
  CATEGORY_IDS,
  CATEGORY_LABELS,
  DENSITY_IDS,
  DENSITY_LABELS,
  LANGUAGE_IDS,
  LANGUAGE_LABELS,
  PP_LABELS,
  PP_SCORES,
  REGION_IDS,
  REGION_LABELS,
  SEGMENT_IDS,
  SEGMENT_LABELS,
  type Lang,
} from "@/lib/taxonomy";

/**
 * The six primary filters from `reference/09` "Search-engine filter workspace",
 * plus density as the one advanced dimension the seed data can support.
 *
 * Each group is a real `<fieldset>` of checkboxes so keyboard and screen-reader
 * users get grouping and state for free. Selection is OR within a group and AND
 * across groups — stated in the rail rather than left implicit, because a user
 * cannot otherwise predict what an empty result means.
 */

type Option = {
  readonly value: string;
  readonly label: string;
  readonly swatch?: string;
  readonly swatchText?: string;
};

function FilterGroup({
  title,
  hint,
  options,
  selected,
  onToggle,
}: {
  title: string;
  hint?: string;
  options: readonly Option[];
  selected: readonly string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset className="border-t border-hairline pt-3 first:border-t-0 first:pt-0">
      <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {title}
      </legend>
      {hint && <p className="mb-2 -mt-1 text-[11px] leading-snug text-ink-muted">{hint}</p>}
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const active = selected.includes(option.value);
          return (
            <label
              key={option.value}
              className={[
                "inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                active
                  ? "border-flare bg-flare font-semibold text-flare-ink"
                  : "border-hairline bg-surface text-ink hover:border-flare/60",
              ].join(" ")}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={active}
                onChange={() => onToggle(option.value)}
              />
              {option.swatch && (
                <span
                  aria-hidden="true"
                  className="grid size-4 place-items-center rounded-full text-[9px] font-bold"
                  style={{
                    backgroundColor: option.swatch,
                    color: option.swatchText ?? "#FFFFFF",
                  }}
                >
                  {option.swatchText ? option.value : ""}
                </span>
              )}
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function FilterRail({
  lang,
  query,
  onToggle,
  onReset,
  hasFilters,
  onLayerChange,
}: {
  lang: Lang;
  query: Query;
  onToggle: (patch: FilterPatch) => void;
  onReset: () => void;
  hasFilters: boolean;
  onLayerChange: (layer: import("@/lib/taxonomy").ThematicLayer) => void;
}) {
  return (
    <div className="flex flex-col gap-5 p-4">
      {/* Layer selection sits above the filters, as in the reference layout. */}
      <IntelligenceLayerRail lang={lang} layer={query.layer} onLayerChange={onLayerChange} />
      <Legend lang={lang} layer={query.layer} />

      <div className="flex items-center justify-between gap-2 border-t border-hairline pt-4">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
          {t("filters", lang)}
        </h2>
        <button
          type="button"
          onClick={onReset}
          disabled={!hasFilters}
          className="rounded-md border border-hairline px-2 py-1 text-xs font-medium text-ink hover:border-uae-red hover:text-uae-red disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("reset", lang)}
        </button>
      </div>

      <p className="rounded-md bg-raised px-2.5 py-2 text-[11px] leading-snug text-ink-muted">
        {t("filterLogic", lang)}
      </p>

      <FilterGroup
        title={t("region", lang)}
        options={REGION_IDS.map((id) => ({
          value: id,
          label: bi(REGION_LABELS[id], lang),
        }))}
        selected={query.regions}
        onToggle={(value) =>
          onToggle({ key: "regions", value: value as (typeof REGION_IDS)[number] })
        }
      />

      <FilterGroup
        title={t("areaCategory", lang)}
        options={CATEGORY_IDS.map((id) => ({
          value: id,
          label: bi(CATEGORY_LABELS[id], lang),
          swatch: CATEGORY_COLORS[id],
        }))}
        selected={query.categories}
        onToggle={(value) =>
          onToggle({ key: "categories", value: value as (typeof CATEGORY_IDS)[number] })
        }
      />

      <FilterGroup
        title={t("purchasingPower", lang)}
        options={PP_SCORES.map((score) => ({
          value: String(score),
          label: bi(PP_LABELS[score], lang),
          swatch: ppFill(score),
          swatchText: ppText(score),
        }))}
        selected={query.pp.map(String)}
        onToggle={(value) =>
          onToggle({ key: "pp", value: Number(value) as (typeof PP_SCORES)[number] })
        }
      />

      <FilterGroup
        title={t("language", lang)}
        options={LANGUAGE_IDS.map((id) => ({
          value: id,
          label: bi(LANGUAGE_LABELS[id], lang),
        }))}
        selected={query.languages}
        onToggle={(value) =>
          onToggle({ key: "languages", value: value as (typeof LANGUAGE_IDS)[number] })
        }
      />

      <FilterGroup
        title={t("community", lang)}
        options={SEGMENT_IDS.map((id) => ({
          value: id,
          label: bi(SEGMENT_LABELS[id], lang),
        }))}
        selected={query.segments}
        onToggle={(value) =>
          onToggle({ key: "segments", value: value as (typeof SEGMENT_IDS)[number] })
        }
      />

      <FilterGroup
        title={t("density", lang)}
        hint={t("densityDerived", lang)}
        options={DENSITY_IDS.map((id) => ({
          value: id,
          label: bi(DENSITY_LABELS[id], lang),
        }))}
        selected={query.densities}
        onToggle={(value) =>
          onToggle({ key: "densities", value: value as (typeof DENSITY_IDS)[number] })
        }
      />
    </div>
  );
}
