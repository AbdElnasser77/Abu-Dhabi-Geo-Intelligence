import { AREAS } from "@/lib/data/areas";
import { HEADLINE_METRICS, type HeadlineMetric } from "@/lib/data/emirate";
import { LANGUAGE_LABELS, SEGMENT_LABELS, type LanguageId } from "@/lib/taxonomy";

/**
 * Figures for the market-signals section.
 *
 * Everything here is COMPUTED from `AREAS` or looked up in `HEADLINE_METRICS`.
 * Nothing is typed in by hand, so a change to the seed data moves these numbers
 * with it and they cannot quietly go stale.
 *
 * The distinction that matters, and the reason the labels are worded so carefully
 * downstream: a count of localities is not a share of population. Twenty-five of
 * twenty-five localities list Arabic as a priority language; that says nothing
 * about what fraction of Abu Dhabi's residents speak it, and the reference package
 * publishes no such figure. Rendering "Arabic 95%" would be inventing a statistic.
 * These are `calculated` — arithmetic over our own seed rows — and are badged that
 * way, never `official`.
 */

export const LOCALITY_TOTAL = AREAS.length;

export type Coverage<T extends string> = {
  readonly id: T;
  /** How many of the seed localities list it. */
  readonly count: number;
};

function tally<T extends string>(pick: (area: (typeof AREAS)[number]) => readonly T[]) {
  const counts = new Map<T, number>();
  for (const area of AREAS) {
    for (const key of pick(area)) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));
}

/** Priority languages, most widely listed first. */
export const LANGUAGE_COVERAGE: readonly Coverage<LanguageId>[] = tally(
  (area) => area.languages,
);

/** Community segments, most widely listed first. */
export const SEGMENT_COVERAGE: readonly Coverage<keyof typeof SEGMENT_LABELS>[] = tally(
  (area) => area.segments,
);

/**
 * The island-and-waterfront premium corridor: every `premium` locality in the
 * Abu Dhabi region. Derived rather than listed by name — the filter is what
 * defines the set, so it cannot fall out of step with the data.
 *
 * It resolves to Al Bateen, Al Maryah Island, Saadiyat Island, Yas Island and
 * Al Raha Beach. Al Muwaiji is `premium` too but sits in Al Ain, inland, so the
 * region filter is doing real work here and is not decoration.
 */
export const PREMIUM_CORRIDOR = AREAS.filter(
  (area) => area.category === "premium" && area.region === "abu_dhabi",
);

const CORRIDOR_PP = PREMIUM_CORRIDOR.map((area) => area.pp);

export const CORRIDOR_PP_MIN = Math.min(...CORRIDOR_PP);
export const CORRIDOR_PP_MAX = Math.max(...CORRIDOR_PP);

/** Lookup into the official SCAD figures, so a typo fails loudly. */
export function officialMetric(key: string): HeadlineMetric {
  const found = HEADLINE_METRICS.find((metric) => metric.key === key);
  if (!found) throw new Error(`Unknown headline metric: ${key}`);
  return found;
}

/**
 * The one figure in this section that is genuinely OFFICIAL: 54% of the emirate
 * is aged 25–44 (SCAD, 2024). It is also the only number here that describes
 * people rather than describing our dataset.
 */
export const AGE_25_44 = officialMetric("age_25_44");
export const MEDIAN_AGE = officialMetric("median_age");
export const WORKING_AGE = officialMetric("working_age");

/** Guard: the labels must cover every id these tallies can produce. */
export function labelledLanguages(): readonly Coverage<LanguageId>[] {
  return LANGUAGE_COVERAGE.filter((entry) => entry.id in LANGUAGE_LABELS);
}
