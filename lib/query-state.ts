/**
 * URL <-> Query serialisation.
 *
 * `reference/15 §3` requires valid query state to persist in the URL for
 * sharing and browser navigation, and `reference/10` requires unknown values to
 * be validated and to "fail gracefully". So parsing is total: anything
 * unrecognised is dropped rather than thrown, and a malformed URL degrades to
 * the default view instead of an error page.
 *
 * Parameter names follow `reference/10` "URL state" where it names them
 * (`region`, `area`, `layer`, `pp`, `types`, `languages`, `communities`,
 * `density`, `q`).
 */

import { areaById } from "@/lib/data/areas";
import { EMPTY_QUERY, type Query } from "@/lib/filter";
import {
  CATEGORY_IDS,
  DENSITY_IDS,
  LANGUAGE_IDS,
  PP_SCORES,
  REGION_IDS,
  SEGMENT_IDS,
  THEMATIC_LAYERS,
  type CategoryId,
  type DensityId,
  type Lang,
  type LanguageId,
  type PurchasingPower,
  type RegionId,
  type SegmentId,
  type ThematicLayer,
} from "@/lib/taxonomy";

/** Reads a single value for a key, whatever the params container is. */
type Getter = (key: string) => string | null;

export function getterFromSearchParams(params: URLSearchParams | { get(k: string): string | null }): Getter {
  return (key) => params.get(key);
}

export function getterFromRecord(
  record: Record<string, string | string[] | undefined>,
): Getter {
  return (key) => {
    const raw = record[key];
    if (Array.isArray(raw)) return raw[0] ?? null;
    return raw ?? null;
  };
}

/** Parses a comma-separated list, keeping only members of `allowed`, de-duplicated. */
function parseList<T extends string>(raw: string | null, allowed: readonly T[]): T[] {
  if (!raw) return [];
  const valid = new Set<string>(allowed);
  const seen = new Set<T>();
  for (const piece of raw.split(",")) {
    const token = piece.trim();
    if (valid.has(token)) seen.add(token as T);
  }
  // Emit in `allowed` order so URLs are canonical and shareable links are stable.
  return allowed.filter((a) => seen.has(a));
}

function parsePp(raw: string | null): PurchasingPower[] {
  if (!raw) return [];
  const seen = new Set<PurchasingPower>();
  for (const piece of raw.split(",")) {
    const n = Number(piece.trim());
    if (PP_SCORES.includes(n as PurchasingPower)) seen.add(n as PurchasingPower);
  }
  return PP_SCORES.filter((s) => seen.has(s));
}

function parseLang(raw: string | null): Lang {
  return raw === "ar" ? "ar" : "en";
}

function parseLayer(raw: string | null): ThematicLayer {
  return THEMATIC_LAYERS.includes(raw as ThematicLayer)
    ? (raw as ThematicLayer)
    : EMPTY_QUERY.layer;
}

export function parseQuery(get: Getter): Query {
  const areaParam = get("area");
  return {
    q: (get("q") ?? "").slice(0, 120),
    regions: parseList<RegionId>(get("region"), REGION_IDS),
    categories: parseList<CategoryId>(get("types"), CATEGORY_IDS),
    languages: parseList<LanguageId>(get("languages"), LANGUAGE_IDS),
    segments: parseList<SegmentId>(get("communities"), SEGMENT_IDS),
    pp: parsePp(get("pp")),
    densities: parseList<DensityId>(get("density"), DENSITY_IDS),
    layer: parseLayer(get("layer")),
    // Drop a selection that points at an area that does not exist.
    area: areaById(areaParam) ? areaParam : null,
    lang: parseLang(get("lang")),
  };
}

/**
 * Serialise a query back to search params. Defaults are omitted so a clean view
 * has a clean URL, and keys are written in a fixed order so the same query
 * always produces the same string.
 */
export function toSearchParams(query: Query): URLSearchParams {
  const params = new URLSearchParams();
  const trimmed = query.q.trim();
  if (trimmed) params.set("q", trimmed);
  if (query.regions.length) params.set("region", query.regions.join(","));
  if (query.categories.length) params.set("types", query.categories.join(","));
  if (query.languages.length) params.set("languages", query.languages.join(","));
  if (query.segments.length) params.set("communities", query.segments.join(","));
  if (query.pp.length) params.set("pp", query.pp.join(","));
  if (query.densities.length) params.set("density", query.densities.join(","));
  if (query.layer !== EMPTY_QUERY.layer) params.set("layer", query.layer);
  if (query.area) params.set("area", query.area);
  if (query.lang !== "en") params.set("lang", query.lang);
  return params;
}

/** A relative URL for a query — "?a=b", or "?" when everything is default. */
export function toHref(query: Query): string {
  const qs = toSearchParams(query).toString();
  return qs ? `?${qs}` : "?";
}

/** Clears every filter dimension but keeps language and layer (reference/15 §3). */
export function resetQuery(query: Query): Query {
  return {
    ...EMPTY_QUERY,
    layer: query.layer,
    lang: query.lang,
  };
}
