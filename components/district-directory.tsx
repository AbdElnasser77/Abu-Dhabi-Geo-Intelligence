"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AREAS } from "@/lib/data/areas";
import { normalize } from "@/lib/filter";
import { bi, formatNumber, t } from "@/lib/i18n";
import { CATEGORY_LABELS, REGION_LABELS, type Lang } from "@/lib/taxonomy";

/**
 * Section 03 — the Abu Dhabi Region district list, as a way into the map.
 *
 * Every card is a real `Link`, not a button with a click handler. Selection in
 * this app lives in the URL (`?area=`), which is exactly what clicking a marker
 * writes — so a link to `?area=<id>#map-pane` reproduces a marker click on the
 * map below, opens that locality's profile, and scrolls the map into view, all
 * without this section knowing anything about the map's internals. It is also
 * shareable and middle-clickable, which a click handler would not be.
 *
 * The list is derived (`region === "abu_dhabi"`), not typed out, so it cannot
 * drift from the dataset. That yields 15 districts; the design it came from
 * showed 9 and merged "Mussafah & ICAD" into one card. The subtitles are the real
 * `CATEGORY_LABELS` rather than the mockup's three-way "Family & mixed-use /
 * Premium & professional / Workforce & commercial" grouping, which is not a
 * taxonomy this dataset has.
 */

const DISTRICTS = AREAS.filter((area) => area.region === "abu_dhabi");

export function DistrictDirectory({ lang }: { lang: Lang }) {
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const needle = normalize(query).trim();
    if (!needle) return DISTRICTS;
    // Same folding the map's own search uses, so Arabic spellings behave the
    // same here as they do in the workspace.
    return DISTRICTS.filter((area) => {
      const hay = normalize(
        [
          area.nameEn,
          area.nameAr,
          ...area.aliases,
          CATEGORY_LABELS[area.category].en,
          CATEGORY_LABELS[area.category].ar,
          area.areaType.en,
          area.areaType.ar,
        ].join(" "),
      );
      return needle.split(" ").every((term) => hay.includes(term));
    });
  }, [query]);

  return (
    <section
      id="districts"
      aria-labelledby="districts-heading"
      className="scroll-mt-[6.25rem] border-t border-hairline bg-base lg:scroll-mt-topbar"
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 pt-16 pb-20 sm:px-8 lg:px-14">
        <div className="reveal-on-scroll flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-3 text-[10.5px] font-semibold tracking-[0.2em] text-flare uppercase">
              <span aria-hidden="true" className="h-px w-8 bg-flare/60" />
              <span className="tabular-nums">03</span>
              <span aria-hidden="true" className="text-ink-faint">
                /
              </span>
              {t("dirEyebrow", lang)}
            </p>
            <h2
              id="districts-heading"
              className="mt-5 text-[2rem] leading-[1.05] tracking-[-0.03em] text-ink sm:text-4xl lg:text-5xl"
            >
              {t("drillInto", lang)} {bi(REGION_LABELS.abu_dhabi, lang)}.
            </h2>
          </div>

          <div className="w-full lg:w-auto lg:min-w-[19rem]">
            <label className="sr-only" htmlFor="district-search">
              {t("dirSearchPlaceholder", lang)}
            </label>
            <input
              id="district-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("dirSearchPlaceholder", lang)}
              className="w-full rounded-lg border border-hairline bg-surface px-3.5 py-2.5 text-[13px] text-ink transition-colors placeholder:text-ink-faint focus:border-flare/70"
            />
          </div>
        </div>

        {shown.length === 0 ? (
          <p className="mt-10 rounded-xl border border-dashed border-hairline bg-surface px-4 py-10 text-center text-[13px] text-ink-muted">
            {t("dirNoMatch", lang)}
          </p>
        ) : (
          <ul className="reveal-stagger mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((area, index) => {
              // `lang` has to ride along or following the link would drop the
              // reader back into English.
              const params = new URLSearchParams({ area: area.id });
              if (lang === "ar") params.set("lang", "ar");
              return (
                <li key={area.id}>
                  <Link
                    href={`/?${params.toString()}#map-pane`}
                    aria-label={`${lang === "ar" ? area.nameAr : area.nameEn} — ${t("dirOpenOnMap", lang)}`}
                    className="group flex items-center gap-4 rounded-xl border border-hairline bg-surface px-4 py-3.5 transition-colors hover:border-hairline-strong hover:bg-raised"
                  >
                    <span
                      aria-hidden="true"
                      className="w-6 shrink-0 text-[11px] text-ink-faint tabular-nums"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] text-ink">
                        {lang === "ar" ? area.nameAr : area.nameEn}
                      </span>
                      <span className="mt-0.5 block truncate text-[11.5px] text-ink-faint">
                        {bi(CATEGORY_LABELS[area.category], lang)} ·{" "}
                        {bi(area.areaType, lang)}
                      </span>
                    </span>
                    {/* Mirrors under RTL so it points the way the text runs. */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-ink-faint transition-colors group-hover:text-flare rtl:-scale-x-100"
                    >
                      <path d="M7 17 17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-6 text-[11.5px] text-ink-faint">
          <span className="tabular-nums">{formatNumber(shown.length, lang)}</span>{" "}
          {t("dirCount", lang)} · {bi(REGION_LABELS.abu_dhabi, lang)}
        </p>
      </div>
    </section>
  );
}
