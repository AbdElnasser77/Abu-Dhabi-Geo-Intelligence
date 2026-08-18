import type { Metadata } from "next";
import { Suspense } from "react";

import { BaselineStrip } from "@/components/baseline-strip";
import { DocumentLang } from "@/components/document-lang";
import { Hero } from "@/components/hero";
import { DistrictDirectory } from "@/components/district-directory";
import { EvidenceTiers } from "@/components/evidence-tiers";
import { RevealFallback } from "@/components/reveal-fallback";
import { SiteFooter } from "@/components/site-footer";
import { MarketSignals } from "@/components/market-signals";
import { Workspace } from "@/components/workspace";
import { dir, htmlLang, t } from "@/lib/i18n";
import { getterFromRecord, parseQuery } from "@/lib/query-state";

/**
 * The workspace lives on a single route and keeps its whole query in the URL.
 *
 * This stays a Server Component for two reasons: `metadata` is only supported in
 * Server Components, and reading `lang` here means `dir` is already correct in
 * the first HTML response — there is no RTL flash on load. Filter changes after
 * that are applied shallowly via the History API and never re-run this function.
 */

export async function generateMetadata({
  searchParams,
}: PageProps<"/">): Promise<Metadata> {
  const { lang } = parseQuery(getterFromRecord(await searchParams));
  return {
    title: t("brand", lang),
    description: t("tagline", lang),
  };
}

export default async function Page({ searchParams }: PageProps<"/">) {
  const query = parseQuery(getterFromRecord(await searchParams));

  return (
    <div
      dir={dir(query.lang)}
      lang={htmlLang(query.lang)}
      className="flex flex-1 flex-col"
    >
      {/* Mirrors lang/dir onto <html> for assistive technology. */}
      <DocumentLang lang={query.lang} />
      {/* Drives the scroll reveals where `animation-timeline: view()` is missing. */}
      <RevealFallback />
      {/* Above the workspace: a minimal hero, then the scope-and-provenance
          strip that carries what the hero deliberately leaves out. Both are
          removable without touching the tool below them. */}
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
        <Hero lang={query.lang} />
        {/* Rises over the pinned hero and dissolves the seam between them. */}
        <MarketSignals lang={query.lang} />
      </div>
      <BaselineStrip lang={query.lang} />
      <Suspense fallback={null}>
        <Workspace initialQuery={query} />
      </Suspense>

      {/*
        Both of these close the page, below the tool.

        The footer used to be rendered by `Workspace`, which made it impossible to
        put anything after it — so it now lives here, where a page footer belongs,
        and these two sections sit above it. The district cards still link up to
        `#map-pane`; the map is simply above them now rather than below.
      */}
      <DistrictDirectory lang={query.lang} />
      <EvidenceTiers lang={query.lang} />
      <SiteFooter lang={query.lang} />
    </div>
  );
}
