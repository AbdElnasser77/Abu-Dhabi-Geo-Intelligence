"use client";

import { useEffect, useState } from "react";

import { REFERENCE_YEAR } from "@/lib/data/emirate";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/taxonomy";

/**
 * Sticky top navigation (`reference/01` "Dashboard layout", item 1): the
 * wordmark in caps, the current geographic context beneath it, and the live
 * match count and data-year baseline on the far side.
 *
 * The reference implementation draws this as a solid dark-emerald band. On a
 * black page a solid band of any colour reads as a second, competing surface, so
 * it is a translucent near-black bar with one hairline under it instead — the
 * content scrolls visibly beneath, which is what tells the reader the bar is
 * pinned. `supports-[backdrop-filter]` guards the transparency: without blur
 * support the bar goes fully opaque rather than letting the table show through
 * the text.
 *
 * The data year is a label rather than the selector the spec sketches, because
 * 2024 is the only reference year in the dataset — a dropdown with one option
 * implies time-series capability that does not exist yet.
 *
 * It is `fixed`, not `sticky`, and that is the difference between the bar
 * existing from the top of the page and the bar existing from the map down.
 *
 * A sticky element is laid out where it sits in the document and can only pin
 * once the scroll reaches it. This component is rendered inside `Workspace`,
 * which is the FOURTH block on the page — hero, signals, baseline, then the
 * workspace — so sticky meant the reader saw no navigation at all until they had
 * scrolled through three full sections. Moving the component earlier in the tree
 * is not available: every control on it is wired to workspace state (the match
 * count, the export scope, the filter toggle), so it has to render inside that
 * client boundary.
 *
 * `fixed` decouples the two. The bar paints at the top of the VIEWPORT no matter
 * where it is declared, so it is present over the hero from the first frame
 * while its markup stays next to the state it operates on.
 *
 * That costs it its place in the flow, which is why:
 *  - it paints over the hero rather than pushing it down — deliberate, the hero
 *    is a full-bleed frame and a black band cropping the top of it looked broken;
 *  - `z-30` has to clear the pinned hero (`z-0`) and the signals section that
 *    rides over it (`z-10`);
 *  - the workspace block subtracts `--spacing-topbar` from its own height, since
 *    the bar now permanently occupies that strip of the viewport.
 *
 * Two things about the geometry, because both are contracts other components
 * depend on rather than local styling choices:
 *
 *  - **The row is width-constrained to the same 1600px as every other band**
 *    (`components/kpi-strip.tsx`, `components/baseline-strip.tsx`, the workspace
 *    `<main>`). The bar's BACKGROUND still runs edge to edge — that is what makes
 *    it read as a bar — but its content has to line up with the KPI cards
 *    underneath it, and it did not: past 1600px the wordmark drifted off toward
 *    the window edge while everything below stayed centred.
 *
 *  - **At `lg` the row is exactly `--spacing-topbar` tall and does not wrap.**
 *    The filter rail and the detail panel stick at `top-topbar`, and the map
 *    block sizes itself to `100svh` minus the same token, so a bar that is any
 *    other height puts a gap under one and pushes the other off screen. Below
 *    `lg` the token is a minimum and the bar is free to gain a row, which is why
 *    the anchors use a larger `scroll-mt` there.
 */
export function TopBar({
  lang,
  onToggleLang,
  onToggleFilters,
  filtersOpen,
}: {
  lang: Lang;
  onToggleLang: () => void;
  onToggleFilters: () => void;
  filtersOpen: boolean;
}) {
  /*
   * Whether the bar has anything behind it worth separating itself from.
   *
   * At the top of the page it floats over the hero photograph, where a solid
   * ground would be a black band across a full-bleed image. Once scrolled it has
   * KPI cards and table rows passing underneath and needs an opaque one.
   *
   * Initialised `false` so the server and the first client render agree — reading
   * `window.scrollY` during render would be a hydration mismatch — then corrected
   * synchronously in the effect, which also covers the reload-at-mid-page case
   * where the browser restores scroll before this mounts.
   *
   * The listener is passive (it never calls `preventDefault`, and saying so lets
   * the browser scroll without waiting on it) and coalesced into a frame, so a
   * fling produces one state change per paint rather than one per scroll event.
   */
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-30 border-b text-ink transition-colors duration-300 print-hide",
        scrolled
          ? "border-hairline bg-base/95 backdrop-blur-md supports-[backdrop-filter]:bg-base/70"
          : // Over the hero: no panel, but not nothing either. A short scrim from
            // the top edge is what guarantees the wordmark and the actions stay
            // legible over an arbitrary photograph — the same reasoning as the
            // hero's own vertical scrim, and it costs nothing on a dark image.
            "border-transparent bg-gradient-to-b from-black/50 to-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex w-full max-w-[1600px] min-h-topbar flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 lg:h-topbar lg:flex-nowrap lg:py-0 lg:px-6">
        <div className="min-w-0">
          {/* Not an <h1>: the hero above now owns the page heading, and two h1s
              on one document is a real problem for screen-reader navigation.
              Visually identical — this is the sticky wordmark, not a title. */}
          {/* The wordmark alone. The second line used to echo the geographic
              context ("Emirate of Abu Dhabi", or the filtered region — "Al Dhafra
              Region" and so on). That context is already stated by the region
              panel, the KPI cards and the active filter chips, and as a subtitle
              under the brand it read as part of the brand. */}
          <p className="truncate font-display text-[13px] font-extrabold uppercase tracking-[0.16em]">
            {t("brand", lang)}
          </p>
        </div>


        {/*
          Section nav. Plain anchors, so they are shareable, middle-clickable and
          work before hydration — and each target carries its own `scroll-mt`, so
          the heading lands below this fixed bar rather than under it.

          Hidden below `sm`: on a phone this row wraps, and three more items turned
          it into a three-line bar taller than the content it was labelling.
        */}
        <nav aria-label={t("navSections", lang)} className="me-auto hidden sm:flex">
          <ul className="flex items-center gap-1">
            {(
              [
                ["#map-pane", "navExplore"],
                ["#signals", "navSignals"],
                ["#districts", "navDistricts"],
              ] as const
            ).map(([href, key]) => (
              <li key={href}>
                <a
                  href={href}
                  className="rounded-md px-2.5 py-1.5 text-[12px] font-medium text-ink-muted transition-colors hover:bg-raised hover:text-ink"
                >
                  {t(key, lang)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          onClick={onToggleFilters}
          aria-expanded={filtersOpen}
          aria-controls="filter-rail"
          className="min-h-9 rounded-md border border-hairline px-2.5 py-1.5 text-[12px] font-medium text-ink transition-colors hover:border-hairline-strong lg:hidden"
        >
          {filtersOpen ? t("hideFilters", lang) : t("showFilters", lang)}
        </button>

        <button
          type="button"
          onClick={onToggleLang}
          aria-label={t("languageSwitch", lang)}
          className="min-h-9 rounded-md border border-hairline px-2.5 py-1.5 text-[12px] font-semibold text-ink transition-colors hover:border-hairline-strong"
        >
          {lang === "en" ? t("switchToArabic", "ar") : t("switchToEnglish", "en")}
        </button>

        <span className="sr-only">
          {t("dataYear", lang)} {REFERENCE_YEAR}
        </span>
      </div>
    </header>
  );
}
