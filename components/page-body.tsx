"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { BaselineStrip } from "@/components/baseline-strip";
import { DistrictDirectory } from "@/components/district-directory";
import { DocumentLang } from "@/components/document-lang";
import { EvidenceTiers } from "@/components/evidence-tiers";
import { Hero } from "@/components/hero";
import { MarketSignals } from "@/components/market-signals";
import { RevealFallback } from "@/components/reveal-fallback";
import { SiteFooter } from "@/components/site-footer";
import { Workspace } from "@/components/workspace";
import { dir, htmlLang } from "@/lib/i18n";
import { getterFromSearchParams, parseQuery } from "@/lib/query-state";
import type { Lang } from "@/lib/taxonomy";

/**
 * The whole page, for one interface language.
 *
 * This used to be the body of `app/page.tsx`, which read `lang` from the
 * server-side `searchParams`. The site is now a static export (GitHub Pages has
 * no server), so there is no request to read: the build prerenders this in
 * English, and `PageBodyFromUrl` re-renders it in the browser from the real URL.
 * An Arabic link therefore paints English for one frame before switching —
 * the unavoidable cost of static hosting.
 */
export function PageBody({ lang }: { lang: Lang }) {
  return (
    <div dir={dir(lang)} lang={htmlLang(lang)} className="flex flex-1 flex-col">
      {/* Mirrors lang/dir (and the title) onto the document. */}
      <DocumentLang lang={lang} />
      {/* Drives the scroll reveals where `animation-timeline: view()` is missing. */}
      <RevealFallback />
      {/* Above the workspace: a minimal hero, then the scope-and-provenance
          strip that carries what the hero deliberately leaves out. */}
      {/*
        The sticky hero MUST be scoped to a containing block that ends, and this
        wrapper is it.

        Without the wrapper the hero sticks for the whole document: it is a
        positioned element with a z-index, so it paints above every later block
        that is not itself positioned, and it stays in the viewport forever. The
        result was the hero silently swallowing every click in the workspace far
        below it — the directory rows could not be clicked at all.

        Scoped like this, the hero is pinned exactly as long as the signals
        section is scrolling over it, then released with the wrapper.
      */}
      <div className="relative">
        <Hero lang={lang} />
        {/* Rises over the pinned hero and dissolves the seam between them. */}
        <MarketSignals lang={lang} />
      </div>
      <BaselineStrip lang={lang} />
      {/* `Workspace` reads the filter query with `useSearchParams`, which on a
          prerendered page must sit under a Suspense boundary. */}
      <Suspense fallback={null}>
        <Workspace lang={lang} />
      </Suspense>
      {/* Both of these close the page, below the tool. The district cards link
          up to `#map-pane`. */}
      <DistrictDirectory lang={lang} />
      <EvidenceTiers lang={lang} />
      <SiteFooter lang={lang} />
    </div>
  );
}

/** `PageBody` in the language the current URL asks for (`?lang=ar`). */
export function PageBodyFromUrl() {
  const searchParams = useSearchParams();
  const { lang } = parseQuery(getterFromSearchParams(searchParams));
  return <PageBody lang={lang} />;
}
