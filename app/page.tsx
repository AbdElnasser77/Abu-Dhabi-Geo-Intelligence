import type { Metadata } from "next";
import { Suspense } from "react";

import { PageBody, PageBodyFromUrl } from "@/components/page-body";
import { t } from "@/lib/i18n";

/**
 * The workspace lives on a single route and keeps its whole query in the URL.
 *
 * The site is a static export (GitHub Pages), so this page cannot read
 * `searchParams` — there is no request at runtime. Instead:
 *
 *  - the build prerenders the page in English, as the Suspense fallback, so the
 *    initial HTML is the complete English page;
 *  - in the browser, `PageBodyFromUrl` reads `?lang=` with `useSearchParams` and
 *    takes over. Language and filter changes after that are client-side only.
 *
 * Metadata is static for the same reason; `components/document-lang.tsx`
 * updates `document.title` when the page is shown in Arabic.
 */

export const metadata: Metadata = {
  title: t("brand", "en"),
  description: t("tagline", "en"),
};

export default function Page() {
  return (
    <Suspense fallback={<PageBody lang="en" />}>
      <PageBodyFromUrl />
    </Suspense>
  );
}
