"use client";

import { useEffect, useState } from "react";

import { ConfidenceBadge } from "@/components/confidence-badge";
import { BlackHoleHeroSection } from "@/components/ui/blackhole-hero-section";
import { AREAS } from "@/lib/data/areas";
import { EMIRATE, REFERENCE_YEAR, REGIONS, sourceById } from "@/lib/data/emirate";
import { bi, formatNumber, t } from "@/lib/i18n";
import type { Lang } from "@/lib/taxonomy";

/**
 * Landing hero above the workspace.
 *
 * Two project rules shape everything here rather than the visual alone:
 *
 *  - **Every displayed number carries a status.** The emirate population is the
 *    official SCAD figure and is badged `official` with its source and year.
 *    The region and locality counts are counts of our own seed dataset, so they
 *    are badged `calculated` — not `official`, because nobody published them.
 *    A hero is exactly where a headline number gets quoted loose, and that is
 *    the one place `reference/00` does not permit it.
 *  - **Bilingual, both directions.** Copy comes from `lib/i18n.ts`, and the art
 *    itself mirrors: the hole moves to whichever side the reading column is
 *    not on, and the scrim darkens the side the reading column is.
 *
 * Both CTAs point at anchors the workspace really renders (`#map-pane`,
 * `#results`) — no link here promises a route that was deferred.
 */

/** True while the viewport is narrow. Drives the layout swap below. */
function useNarrow(query = "(max-width: 767px)") {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const sync = () => setNarrow(m.matches);
    sync();
    m.addEventListener("change", sync);
    return () => m.removeEventListener("change", sync);
  }, [query]);
  return narrow;
}

export function Hero({ lang }: { lang: Lang }) {
  const narrow = useNarrow();
  const rtl = lang === "ar";
  const source = sourceById(EMIRATE.sourceId);

  /*
   * Where the hole sits, and which edge is veiled. The reading column is on the
   * inline-start side, so under RTL both flip — otherwise the Arabic copy would
   * land on top of the brightest part of the disc.
   */
  const focus: [number, number] = narrow
    ? [0.5, 0.78]
    : rtl
      ? [0.26, 0.44]
      : [0.74, 0.44];
  const scrim = narrow ? "top" : rtl ? "right" : "left";

  return (
    <section className="relative min-h-[92svh] w-full print-hide md:min-h-[680px]">
      <BlackHoleHeroSection
        focus={focus}
        scrim={scrim}
        scrimStrength={0.92}
        distance={24}
        elevation={narrow ? -7 : -5.5}
        fov={narrow ? 58 : 42}
        // Brand palette, and it happens to be the physically right ordering:
        // hottest gas at the inner rim reads near-white, cooling outward
        // through gold to deep red. `reference/09` sand, gold and UAE red.
        hotColor="#FFF6E4"
        midColor="#C99A2E"
        coolColor="#C8102E"
        glow={narrow ? 0.85 : 1}
        // Trimmed from the component's defaults (300 / 0.7): this page also
        // boots a MapLibre GL context below the fold, so the hero does not get
        // to spend the whole frame budget.
        steps={narrow ? 190 : 260}
        resolution={narrow ? 0.58 : 0.66}
      >
        <div className="flex h-full min-h-[92svh] items-start px-5 pt-16 sm:px-8 md:min-h-[680px] md:items-center md:pt-0 lg:px-14">
          <div className="max-w-[36rem]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">
              {t("brand", lang)}
            </p>

            <h1 className="mt-4 text-[2.1rem] font-light leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.5rem]">
              {t("heroTitle", lang)}
            </h1>

            <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-white/65">
              {t("heroBody", lang)}
            </p>

            {/*
              Three figures, three statuses. The population is SCAD's; the two
              counts are ours, and are labelled as derived rather than borrowing
              the official badge sitting next to them.
            */}
            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
              <div>
                <dt className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white/50">
                  {t("populationLabel", lang)}
                </dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums text-white">
                  {formatNumber(EMIRATE.population, lang)}
                </dd>
                <dd className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <ConfidenceBadge status={EMIRATE.status} lang={lang} size="sm" />
                  <span className="text-[10.5px] text-white/50">
                    {bi(source.publisher, lang)} ·{" "}
                    <span className="tabular-nums">{REFERENCE_YEAR}</span>
                  </span>
                </dd>
              </div>

              <div>
                <dt className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white/50">
                  {t("regionsCovered", lang)}
                </dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums text-white">
                  {formatNumber(REGIONS.length, lang)}
                </dd>
                <dd className="mt-1.5">
                  <ConfidenceBadge status="calculated" lang={lang} size="sm" />
                </dd>
              </div>

              <div>
                <dt className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white/50">
                  {t("seedLocalities", lang)}
                </dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums text-white">
                  {formatNumber(AREAS.length, lang)}
                </dd>
                <dd className="mt-1.5">
                  <ConfidenceBadge status="calculated" lang={lang} size="sm" />
                </dd>
              </div>
            </dl>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#map-pane"
                className="inline-flex min-h-11 items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-charcoal transition hover:bg-white/90"
              >
                {t("heroOpenWorkspace", lang)}
              </a>
              <a
                href="#results"
                className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white/80 transition hover:border-white/50 hover:text-white"
              >
                {t("heroBrowseDirectory", lang)}
              </a>
            </div>

            {/*
              No governance paragraph here on purpose. The rule is already made
              twice over within one scroll: the body copy above states it in the
              hero's own voice, and the gold band immediately below the fold
              states it in full. A third copy would just be noise.
            */}
          </div>
        </div>
      </BlackHoleHeroSection>
    </section>
  );
}
