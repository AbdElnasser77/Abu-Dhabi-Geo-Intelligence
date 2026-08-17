/**
 * Colour assignments for the thematic layers.
 *
 * Purchasing-power colours are fixed by `reference/14_website_seed_data.json`
 * and must not be changed. What IS a decision here is the text colour placed
 * on top of them: white fails WCAG 2.2 AA on the gold and orange bands, so
 * those two carry charcoal instead. Measured contrast ratios:
 *
 *   1  #B91C1C  white     6.47:1  pass
 *   2  #EA580C  white     3.56:1  FAIL  -> charcoal  5.10:1  pass
 *   3  #C99A2E  white     2.58:1  FAIL  -> charcoal  7.05:1  pass
 *   4  #16865B  white     4.58:1  pass
 *   5  #064E3B  white    13.4 :1  pass
 *
 * `reference/09` also forbids encoding purchasing power by colour alone, which
 * is why the score digit is rendered inside every marker.
 */

import { PP_COLORS } from "@/lib/data/emirate";
import type { Area } from "@/lib/data/areas";
import type {
  CategoryId,
  DataStatus,
  LanguageId,
  PurchasingPower,
  SegmentId,
  ThematicLayer,
} from "@/lib/taxonomy";

export const CHARCOAL = "#121826";
export const WHITE = "#FFFFFF";

/**
 * Fills too light to carry white text at AA. Everything else in this module was
 * chosen dark enough that white passes, so this is the exception list rather
 * than a per-colour table that could drift out of step.
 */
const LIGHT_FILLS: ReadonlySet<string> = new Set(["#EA580C", "#C99A2E", "#F5F1E8"]);

export function textOn(fill: string): string {
  return LIGHT_FILLS.has(fill.toUpperCase()) ? CHARCOAL : WHITE;
}

export function ppFill(score: PurchasingPower): string {
  return PP_COLORS[score];
}

export function ppText(score: PurchasingPower): string {
  return textOn(PP_COLORS[score]);
}

/**
 * Housing / area-category scale. All six are dark enough for white text at AA
 * (lowest is #B45309 at 5.02:1).
 */
export const CATEGORY_COLORS: Record<CategoryId, string> = {
  premium: "#064E3B",
  family: "#0B7A53",
  mixed: "#1E4E8C",
  industrial: "#475569",
  operations: "#B45309",
  oasis_island: "#0E7490",
};

/**
 * Primary-nationality scale. Only five of these actually occur as a leading tag
 * across the 25 localities (Emirati 17, Western 3, Arab 2, Indian 2, Filipino 1),
 * so the legend stays readable; the rest are defined so a future dataset cannot
 * fall through to an undefined colour.
 */
export const SEGMENT_COLORS: Record<SegmentId, string> = {
  emirati: "#064E3B",
  arab: "#0B7A53",
  indian: "#B45309",
  pakistani: "#92400E",
  bangladeshi: "#7C2D12",
  nepali: "#A16207",
  filipino: "#1E4E8C",
  asian: "#0E7490",
  western: "#6D28D9",
  russian_speaking: "#7E22CE",
  african: "#BE123C",
  hnwi: "#C99A2E",
  diplomatic: "#475569",
  workforce: "#57534E",
  visitors: "#0F766E",
};

/** Primary-language scale. Arabic, English and Hindi/Urdu are the ones that lead. */
export const LANGUAGE_COLORS: Record<LanguageId, string> = {
  arabic: "#064E3B",
  english: "#1E4E8C",
  hindi_urdu: "#B45309",
  malayalam: "#0E7490",
  tagalog: "#6D28D9",
  bengali: "#BE123C",
  nepali: "#A16207",
  russian: "#7E22CE",
};

/**
 * Confidence scale. Every seed locality is `qualitative`, so this layer renders
 * uniformly — which is itself the point: it makes visible that no district-level
 * figure in this dataset is official.
 */
export const STATUS_COLORS: Record<DataStatus, string> = {
  official: "#064E3B",
  calculated: "#0B7A53",
  indicative: "#1E4E8C",
  modeled: "#B45309",
  qualitative: "#7E22CE",
  unavailable: "#475569",
};

/** The leading tag is the source's own priority order — see PRIMARY_TAG_NOTE. */
export function primarySegment(area: Area): SegmentId | null {
  return area.segments[0] ?? null;
}

export function primaryLanguage(area: Area): LanguageId | null {
  return area.languages[0] ?? null;
}

export type Swatch = { readonly fill: string; readonly text: string };

const NEUTRAL: Swatch = { fill: "#475569", text: WHITE };

/** The fill/text pair an area's marker should use under the active layer. */
export function swatchFor(area: Area, layer: ThematicLayer): Swatch {
  switch (layer) {
    case "pp":
      return { fill: ppFill(area.pp), text: ppText(area.pp) };
    case "housing": {
      const fill = CATEGORY_COLORS[area.category];
      return { fill, text: textOn(fill) };
    }
    case "nationality": {
      const id = primarySegment(area);
      if (!id) return NEUTRAL;
      const fill = SEGMENT_COLORS[id];
      return { fill, text: textOn(fill) };
    }
    case "language": {
      const id = primaryLanguage(area);
      if (!id) return NEUTRAL;
      const fill = LANGUAGE_COLORS[id];
      return { fill, text: textOn(fill) };
    }
    case "confidence": {
      const fill = STATUS_COLORS[area.dataStatus];
      return { fill, text: textOn(fill) };
    }
    // Not selectable — `LAYER_AVAILABLE` gates these. Fall back rather than throw
    // so a stale URL cannot break the map.
    case "population":
    case "healthcare":
      return { fill: ppFill(area.pp), text: ppText(area.pp) };
  }
}

/** Whether the marker should show its purchasing-power digit under this layer. */
export function showsScoreDigit(layer: ThematicLayer): boolean {
  return layer === "pp";
}
