import { ConfidenceBadge } from "@/components/confidence-badge";
import {
  AGE_25_44,
  CORRIDOR_PP_MAX,
  CORRIDOR_PP_MIN,
  LANGUAGE_COVERAGE,
  LOCALITY_TOTAL,
  MEDIAN_AGE,
  PREMIUM_CORRIDOR,
  SEGMENT_COVERAGE,
  WORKING_AGE,
} from "@/lib/data/signals";
import { REFERENCE_YEAR } from "@/lib/data/emirate";
import { bi, formatNumber, t } from "@/lib/i18n";
import {
  LANGUAGE_LABELS,
  SEGMENT_LABELS,
  type Lang,
} from "@/lib/taxonomy";

/**
 * Market signals — the section that rises out of the hero.
 *
 * Four tiles, laid out as the design calls for: a tall corridor card carrying one
 * oversized figure, a wide coverage card, and two smaller cards beneath it.
 *
 * **On the numbers.** Three of the four tiles report counts of our own seed rows,
 * so they are badged `calculated` and their captions say "localities", never a
 * percentage. One tile — the 25-44 age share — is a genuine SCAD figure and is
 * the only one badged `official`. The design this was drawn from also carried a
 * "service-market fit" tile ranking dermatology, longevity, family health and
 * aesthetic medicine by percentage. Those numbers do not exist in the reference
 * package, and `LAYER_UNAVAILABLE_REASON.healthcare` in lib/taxonomy.ts already
 * records why: ranking service lines needs a facility or POI source that is not
 * connected. So that tile is a community-mix card built from real segment tags,
 * and the gap itself is stated at the foot of the section rather than filled in.
 *
 * The section owns the seam with the hero above it: a transparent-to-black top
 * gradient that the pinned hero shows through, so the photograph bleeds into the
 * copy instead of ending at a visible edge. See the `hero seam` block in
 * app/globals.css.
 */

/** Shared bar row: a label, a proportional track, and a count of localities. */
function CoverageBar({
  label,
  count,
  total,
  lang,
}: {
  label: string;
  count: number;
  total: number;
  lang: Lang;
}) {
  const share = Math.round((count / total) * 100);
  return (
    <li className="grid grid-cols-[7.5rem_minmax(0,1fr)_auto] items-center gap-3 sm:grid-cols-[9rem_minmax(0,1fr)_auto] sm:gap-4">
      <span className="truncate text-[13px] text-ink">{label}</span>
      {/* The track is presentational; the count beside it is the accessible value. */}
      <span
        aria-hidden="true"
        className="h-[3px] w-full overflow-hidden rounded-full bg-hairline"
      >
        <span
          className="bg-flare-gradient block h-full rounded-full"
          style={{ width: `${share}%` }}
        />
      </span>
      <span className="text-[12.5px] font-semibold text-ink tabular-nums">
        {formatNumber(count, lang)}
        <span className="text-ink-faint">/{formatNumber(total, lang)}</span>
      </span>
    </li>
  );
}

function Tile({
  eyebrow,
  children,
  className = "",
}: {
  eyebrow: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface p-6 sm:p-7 ${className}`}
    >
      <p className="text-[10px] font-semibold tracking-[0.18em] text-ink-faint uppercase">
        {eyebrow}
      </p>
      {children}
    </section>
  );
}

export function MarketSignals({ lang }: { lang: Lang }) {
  const languages = LANGUAGE_COVERAGE.slice(0, 5);
  const segments = SEGMENT_COVERAGE.slice(0, 4);
  const ppLabel =
    CORRIDOR_PP_MIN === CORRIDOR_PP_MAX
      ? formatNumber(CORRIDOR_PP_MAX, lang)
      : `${formatNumber(CORRIDOR_PP_MIN, lang)}–${formatNumber(CORRIDOR_PP_MAX, lang)}`;

  // A 54% arc on a circle whose pathLength is normalised to 100, so the dash
  // values ARE percentages and no circumference arithmetic is needed.
  const agePercent = AGE_25_44.value;

  return (
    <div
      id="signals"
      // `z-10` puts this above the pinned hero; the gradient on its top edge is
      // what dissolves the seam. `scroll-mt` clears the sticky bar.
      //
      // There is deliberately NO negative pull. It used to be `-mt-[20svh]`, which
      // started the overlap a fifth of a viewport BEFORE the hero ended — so at
      // rest the blur band and the darkening ramp both sat visibly across the
      // bottom of the hero. Starting flush with the hero keeps that treatment
      // entirely below the fold, and the reveal still happens because the hero is
      // pinned: the section scrolls up over a stationary hero either way.
      // No `bg-base` here on purpose: the ground IS the seam gradient in
      // globals.css, whose top edge is transparent so the pinned hero shows
      // through it. An opaque background would reinstate the hard cut.
      className="hero-seam-below relative z-10 scroll-mt-[6.25rem] lg:scroll-mt-topbar"
    >
      {/* Grain over the black. On a near-black ground the long gradients band
          badly, and a little noise is what stops that reading as cheap. */}
      <div aria-hidden="true" className="bg-grain pointer-events-none absolute inset-0" />

      <div className="relative mx-auto w-full max-w-[1600px] px-5 pt-[24svh] pb-20 sm:px-8 md:pt-[30svh] lg:px-14">
        <header className="reveal-on-scroll">
          <p className="flex items-center gap-3 text-[10.5px] font-semibold tracking-[0.2em] text-flare uppercase">
            <span aria-hidden="true" className="h-px w-8 bg-flare/60" />
            <span className="tabular-nums">02</span>
            <span aria-hidden="true" className="text-ink-faint">/</span>
            {t("signalsEyebrow", lang)}
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
            <h2 className="max-w-[22ch] text-[2.1rem] leading-[1.05] tracking-[-0.03em] text-ink sm:text-5xl lg:text-6xl">
              {t("signalsTitle", lang)}
            </h2>
            <p className="max-w-prose text-[13.5px] leading-relaxed text-ink-muted lg:mt-3 lg:text-sm">
              {t("signalsLead", lang)}
            </p>
          </div>
        </header>

        <div className="reveal-stagger mt-12 grid gap-4 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-5">
          {/* ---- Premium corridor: one oversized figure ---------------- */}
          <Tile eyebrow={t("sigCorridorEyebrow", lang)}>
            <h3 className="mt-4 text-2xl leading-tight text-ink sm:text-[1.7rem]">
              {t("sigCorridorTitle", lang)}
            </h3>
            <p className="mt-3 max-w-prose text-[13px] leading-relaxed text-ink-muted">
              {t("sigCorridorBody", lang)}
            </p>

            <ul className="mt-5 flex flex-wrap gap-1.5">
              {PREMIUM_CORRIDOR.map((area) => (
                <li
                  key={area.id}
                  className="rounded-full border border-hairline bg-raised px-2.5 py-1 text-[11.5px] text-ink-muted"
                >
                  {lang === "ar" ? area.nameAr : area.nameEn}
                </li>
              ))}
            </ul>

            {/* `mt-auto` rather than `justify-between` on the tile: spacing between
                the eyebrow, title and body is set by their own margins, and only
                this block should absorb the slack. */}
            <div className="mt-10 lg:mt-auto lg:pt-16">
              <p className="flex items-baseline gap-1 text-flare-gold">
                <span className="text-[5.5rem] leading-[0.8] font-light tracking-[-0.04em] tabular-nums sm:text-[7rem]">
                  {ppLabel}
                </span>
                <span className="text-xl text-flare/80">/{formatNumber(5, lang)}</span>
              </p>
              <p className="mt-4 text-[10px] font-semibold tracking-[0.18em] text-ink-faint uppercase">
                {t("purchasingPower", lang)}
              </p>
              <p className="mt-2 text-[11.5px] text-ink-muted">
                {t("uniformScore", lang)}
              </p>
              <span className="mt-3 inline-block">
                <ConfidenceBadge status="calculated" lang={lang} size="sm" />
              </span>
            </div>
          </Tile>

          <div className="grid gap-4 lg:gap-5">
            {/* ---- Language coverage ----------------------------------- */}
            <Tile eyebrow={t("sigLanguageEyebrow", lang)}>
              <h3 className="mt-4 text-2xl leading-tight text-ink sm:text-[1.7rem]">
                {t("sigLanguageTitle", lang)}
              </h3>
              <ul className="mt-6 flex flex-col gap-3.5">
                {languages.map((entry) => (
                  <CoverageBar
                    key={entry.id}
                    label={bi(LANGUAGE_LABELS[entry.id], lang)}
                    count={entry.count}
                    total={LOCALITY_TOTAL}
                    lang={lang}
                  />
                ))}
              </ul>
              <p className="mt-6 max-w-prose text-[11.5px] leading-relaxed text-ink-faint">
                {t("sigLanguageNote", lang)}
              </p>
              <span className="mt-3 inline-block">
                <ConfidenceBadge status="calculated" lang={lang} size="sm" />
              </span>
            </Tile>

            <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
              {/* ---- Prime age group: the one official figure --------- */}
              <Tile eyebrow={t("sigAgeEyebrow", lang)}>
                <div className="mt-6 grid place-items-center">
                  <div className="relative grid size-[9.5rem] place-items-center">
                    <svg
                      viewBox="0 0 100 100"
                      className="absolute inset-0 -rotate-90"
                      aria-hidden="true"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        pathLength={100}
                        fill="none"
                        stroke="var(--color-hairline)"
                        strokeWidth="5"
                      />
                      {/* pathLength=100 makes the dash array literal percentages. */}
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        pathLength={100}
                        fill="none"
                        stroke="url(#signals-arc)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray={`${agePercent} 100`}
                      />
                      <defs>
                        <linearGradient id="signals-arc" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="var(--color-flare)" />
                          <stop offset="100%" stopColor="var(--color-flare-gold)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <p className="text-center">
                      <span className="block text-3xl leading-none font-light text-ink tabular-nums">
                        {formatNumber(agePercent, lang)}%
                      </span>
                      <span className="mt-1.5 block text-[9.5px] font-semibold tracking-[0.14em] text-ink-faint uppercase">
                        {bi(AGE_25_44.label, lang)}
                      </span>
                    </p>
                  </div>
                </div>

                <h3 className="mt-6 text-xl leading-tight text-ink">
                  {t("sigAgeTitle", lang)}
                </h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-ink-muted">
                  {t("sigAgeBody", lang)}
                </p>
                <p className="mt-3 text-[11.5px] text-ink-faint">
                  {bi(MEDIAN_AGE.label, lang)}{" "}
                  <span className="tabular-nums text-ink-muted">{MEDIAN_AGE.value}</span>
                  {" · "}
                  {bi(WORKING_AGE.label, lang)}{" "}
                  <span className="tabular-nums text-ink-muted">{WORKING_AGE.value}%</span>
                </p>
                {/* The only official figure in this section. */}
                <span className="mt-3 inline-flex flex-wrap items-center gap-1.5">
                  <ConfidenceBadge status={AGE_25_44.status} lang={lang} size="sm" />
                  <span className="text-[10.5px] text-ink-faint tabular-nums">
                    SCAD · {REFERENCE_YEAR}
                  </span>
                </span>
              </Tile>

              {/* ---- Community mix -------------------------------------- */}
              <Tile eyebrow={t("sigSegmentEyebrow", lang)}>
                <h3 className="mt-4 text-xl leading-tight text-ink">
                  {t("sigSegmentTitle", lang)}
                </h3>
                <ul className="mt-6 flex flex-col gap-3.5">
                  {segments.map((entry) => (
                    <CoverageBar
                      key={entry.id}
                      label={bi(SEGMENT_LABELS[entry.id], lang)}
                      count={entry.count}
                      total={LOCALITY_TOTAL}
                      lang={lang}
                    />
                  ))}
                </ul>
                <p className="mt-auto pt-6 text-[11.5px] leading-relaxed text-ink-faint">
                  {t("sigLanguageNote", lang)}
                </p>
                <span className="mt-3 inline-block">
                  <ConfidenceBadge status="calculated" lang={lang} size="sm" />
                </span>
              </Tile>
            </div>
          </div>
        </div>

        {/* ---- The gap, stated rather than filled --------------------- */}
        <aside className="reveal-on-scroll mt-5 flex flex-col gap-3 rounded-2xl border border-flare-line/60 bg-flare-tint/60 p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-6">
          <span className="mt-0.5 shrink-0">
            <ConfidenceBadge status="unavailable" lang={lang} size="sm" />
          </span>
          <div>
            <h3 className="text-[13.5px] text-ink">{t("sigGapTitle", lang)}</h3>
            <p className="mt-1.5 max-w-[85ch] text-[12.5px] leading-relaxed text-ink-muted">
              {t("sigGapBody", lang)}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
