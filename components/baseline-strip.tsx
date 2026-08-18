import { ConfidenceBadge } from "@/components/confidence-badge";
import { AREAS } from "@/lib/data/areas";
import { REFERENCE_YEAR, REGIONS, SOURCES } from "@/lib/data/emirate";
import { bi, formatNumber, t } from "@/lib/i18n";
import type { Lang } from "@/lib/taxonomy";

/**
 * The content the hero deliberately does not carry: what this dataset covers,
 * and where it comes from.
 *
 * Two rules govern what is and is not here:
 *
 *  - **The counts are ours, so they are badged `calculated`.** They are counts of
 *    the seed dataset, not figures anyone published, and borrowing the `official`
 *    badge from the SCAD population sitting further down the page would be the
 *    exact misattribution `reference/00` forbids.
 *  - **The population is not repeated.** `components/kpi-strip.tsx` already shows
 *    the official emirate and region totals immediately below. This section adds
 *    scope and provenance instead of restating them.
 *
 * It also does the one job the deferred `/sources` route was going to do: put the
 * source list somewhere a reader can actually reach it.
 */
export function BaselineStrip({ lang }: { lang: Lang }) {
  return (
    <section
      // The hero's "executive brief" action scrolls here — this section IS the
      // brief (scope, counts, data year, sources). `scroll-mt` clears the sticky
      // top bar, matching the anchors in components/workspace.tsx: the token at
      // `lg` where the bar is one row, larger below it where the bar wraps.
      id="baseline"
      aria-labelledby="baseline-heading"
      className="scroll-mt-[6.25rem] border-b border-hairline bg-surface lg:scroll-mt-topbar"
    >
      <div className="reveal-on-scroll mx-auto w-full max-w-[1600px] px-4 pt-10 pb-16 lg:px-6">
        <h2
          id="baseline-heading"
          className="text-[10px] font-semibold tracking-[0.14em] text-ink-muted uppercase"
        >
          {t("baselineAndSources", lang)}
        </h2>

        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10">
          <div>
            <dl className="flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <dt className="text-[9.5px] font-semibold tracking-[0.12em] text-ink-muted uppercase">
                  {t("seedLocalities", lang)}
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-ink tabular-nums">
                  {formatNumber(AREAS.length, lang)}
                </dd>
                <dd className="mt-1.5">
                  <ConfidenceBadge status="calculated" lang={lang} size="sm" />
                </dd>
              </div>

              <div>
                <dt className="text-[9.5px] font-semibold tracking-[0.12em] text-ink-muted uppercase">
                  {t("regionsCovered", lang)}
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-ink tabular-nums">
                  {formatNumber(REGIONS.length, lang)}
                </dd>
                <dd className="mt-1.5">
                  <ConfidenceBadge status="calculated" lang={lang} size="sm" />
                </dd>
              </div>

              <div>
                <dt className="text-[9.5px] font-semibold tracking-[0.12em] text-ink-muted uppercase">
                  {t("dataYear", lang)}
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-ink tabular-nums">
                  {REFERENCE_YEAR}
                </dd>
                <dd className="mt-1.5 text-[10.5px] text-ink-muted">
                  {t("onlyYearAvailable", lang)}
                </dd>
              </div>
            </dl>

            <p className="mt-4 max-w-prose text-[11.5px] leading-relaxed text-ink-muted">
              {t("baselineNote", lang)}
            </p>
          </div>

          <div>
            <p className="text-[9.5px] font-semibold tracking-[0.12em] text-ink-muted uppercase">
              {t("sourceLabel", lang)}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {SOURCES.map((source) => (
                <li key={source.id} className="text-[12px] leading-snug">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-flare underline decoration-hairline hover:decoration-flare"
                  >
                    {bi(source.title, lang)}
                  </a>
                  <span className="text-ink-muted"> — {bi(source.publisher, lang)}</span>
                </li>
              ))}
            </ul>

            {/* Its own string, not `DISTRICT_POPULATION_CAVEAT` — that one is
                worded for the profile drawer ("this area", "the profile below")
                and reads as a dangling reference out here. */}
            <p className="mt-3 max-w-prose text-[11.5px] leading-relaxed text-ink-muted">
              {t("districtDataGap", lang)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
