import type { Metadata } from "next";
import { Suspense } from "react";

import { DocumentLang } from "@/components/document-lang";
import { Hero } from "@/components/hero";
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
      {/* Above the workspace, and only here: the hero is one line to remove, and
          the tool below it is untouched by its presence. */}
      <Hero lang={query.lang} />
      <Suspense fallback={null}>
        <Workspace initialQuery={query} />
      </Suspense>
    </div>
  );
}
