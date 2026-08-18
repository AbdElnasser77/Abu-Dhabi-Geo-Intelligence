"use client";

import {
  CATEGORY_COLORS,
  LANGUAGE_COLORS,
  SEGMENT_COLORS,
  STATUS_COLORS,
  ppFill,
  ppText,
  primaryLanguage,
  primarySegment,
  textOn,
} from "@/lib/colors";
import { AREAS } from "@/lib/data/areas";
import { bi, t } from "@/lib/i18n";
import {
  CATEGORY_IDS,
  CATEGORY_LABELS,
  DATA_STATUS_IDS,
  DATA_STATUS_LABELS,
  LANGUAGE_IDS,
  LANGUAGE_LABELS,
  LAYER_AVAILABLE,
  LAYER_UNAVAILABLE_REASON,
  PP_LABELS,
  PP_SCORES,
  PRIMARY_TAG_NOTE,
  SEGMENT_IDS,
  SEGMENT_LABELS,
  THEMATIC_LAYERS,
  THEMATIC_LAYER_LABELS,
  type Lang,
  type ThematicLayer,
} from "@/lib/taxonomy";

/** Values that actually occur, so the legend never lists colours nothing uses. */
const PRESENT_STATUSES = DATA_STATUS_IDS.filter((s) => AREAS.some((a) => a.dataStatus === s));
const PRESENT_PRIMARY_SEGMENTS = SEGMENT_IDS.filter((s) =>
  AREAS.some((a) => primarySegment(a) === s),
);
const PRESENT_PRIMARY_LANGUAGES = LANGUAGE_IDS.filter((l) =>
  AREAS.some((a) => primaryLanguage(a) === l),
);

type Entry = { key: string; fill: string; text: string; glyph?: string; label: string };

function entriesFor(layer: ThematicLayer, lang: Lang): readonly Entry[] {
  switch (layer) {
    case "pp":
      // Highest first, matching the reference implementation's rail.
      return [...PP_SCORES].reverse().map((score) => ({
        key: String(score),
        fill: ppFill(score),
        text: ppText(score),
        glyph: String(score),
        label: bi(PP_LABELS[score], lang),
      }));
    case "housing":
      return CATEGORY_IDS.map((id) => ({
        key: id,
        fill: CATEGORY_COLORS[id],
        text: textOn(CATEGORY_COLORS[id]),
        label: bi(CATEGORY_LABELS[id], lang),
      }));
    case "nationality":
      return PRESENT_PRIMARY_SEGMENTS.map((id) => ({
        key: id,
        fill: SEGMENT_COLORS[id],
        text: textOn(SEGMENT_COLORS[id]),
        label: bi(SEGMENT_LABELS[id], lang),
      }));
    case "language":
      return PRESENT_PRIMARY_LANGUAGES.map((id) => ({
        key: id,
        fill: LANGUAGE_COLORS[id],
        text: textOn(LANGUAGE_COLORS[id]),
        label: bi(LANGUAGE_LABELS[id], lang),
      }));
    case "confidence":
      return PRESENT_STATUSES.map((id) => ({
        key: id,
        fill: STATUS_COLORS[id],
        text: textOn(STATUS_COLORS[id]),
        label: bi(DATA_STATUS_LABELS[id], lang),
      }));
    default:
      return [];
  }
}

/**
 * The numbered "intelligence layer" rail.
 *
 * Two of the seven entries are permanently disabled — `population` and
 * `healthcare` — because the seed dataset cannot support them. They are listed
 * rather than omitted so the gap reads as missing data, with its reason, instead
 * of an oversight. See LAYER_UNAVAILABLE_REASON.
 */
export function IntelligenceLayerRail({
  lang,
  layer,
  onLayerChange,
}: {
  lang: Lang;
  layer: ThematicLayer;
  onLayerChange: (layer: ThematicLayer) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
        {t("intelligenceLayer", lang)}
      </legend>
      <ul className="flex flex-col">
        {THEMATIC_LAYERS.map((id, index) => {
          const available = LAYER_AVAILABLE[id];
          const active = layer === id;
          const reason = LAYER_UNAVAILABLE_REASON[id];
          return (
            <li key={id} className="border-b border-hairline/70 last:border-b-0">
              <label
                className={[
                  "flex items-center gap-2 py-2 text-[13px]",
                  available
                    ? "cursor-pointer hover:text-flare"
                    : "cursor-not-allowed text-ink-muted/60",
                  active ? "font-semibold text-flare" : "text-ink",
                ].join(" ")}
                title={reason ? bi(reason, lang) : undefined}
              >
                <input
                  type="radio"
                  name="thematic-layer"
                  className="sr-only"
                  checked={active}
                  disabled={!available}
                  onChange={() => available && onLayerChange(id)}
                />
                <span className="w-5 shrink-0 text-[10px] tabular-nums text-ink-muted/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">{bi(THEMATIC_LAYER_LABELS[id], lang)}</span>
                {available ? (
                  <span aria-hidden="true" className="text-ink-muted/50">
                    {active ? "●" : "›"}
                  </span>
                ) : (
                  <span className="rounded-sm bg-raised px-1 py-0.5 text-[9px] uppercase tracking-wide text-ink-muted">
                    {t("layerUnavailable", lang)}
                  </span>
                )}
              </label>
              {!available && reason && active === false && (
                <p className="sr-only">{bi(reason, lang)}</p>
              )}
            </li>
          );
        })}
      </ul>
      {(layer === "nationality" || layer === "language") && (
        <p className="mt-2 rounded-md bg-raised px-2 py-1.5 text-[10.5px] leading-snug text-ink-muted">
          {bi(PRIMARY_TAG_NOTE, lang)}
        </p>
      )}
    </fieldset>
  );
}

/** Colour key for the active layer, rendered in the rail beneath the layer list. */
export function Legend({ lang, layer }: { lang: Lang; layer: ThematicLayer }) {
  const entries = entriesFor(layer, lang);
  if (entries.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
        {bi(THEMATIC_LAYER_LABELS[layer], lang)}
      </p>
      <ul className="flex flex-col gap-1.5">
        {entries.map((entry) => (
          <li key={entry.key} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-3 w-6 shrink-0 rounded-sm"
              style={{ backgroundColor: entry.fill }}
            />
            <span className="text-[11.5px] text-ink">
              {entry.glyph ? `${entry.glyph} — ${entry.label}` : entry.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
