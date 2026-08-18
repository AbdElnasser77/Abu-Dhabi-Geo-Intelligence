import { REFERENCE_YEAR, SOURCES } from "@/lib/data/emirate";
import { bi, t } from "@/lib/i18n";
import type { Lang } from "@/lib/taxonomy";

/**
 * Page footer: the data rule, the reference year, the sources, and the basemap
 * attribution the OSM tile policy requires.
 *
 * Extracted from `components/workspace.tsx`, which used to render it. A footer
 * belongs to the page, not to the map tool — and keeping it inside the workspace
 * made it impossible to put anything after it, which is exactly what putting the
 * district and evidence sections at the bottom of the page needs.
 */
export function SiteFooter({ lang }: { lang: Lang }) {
  return (
    <footer className="border-t border-hairline bg-surface text-xs text-ink-muted">
      {/* Fade only, no rise: see `.reveal-fade` in globals.css — a translate on the
          page's last block wobbles the document height as it enters. */}
      <div className="reveal-fade mx-auto w-full max-w-[1600px] px-4 py-10 lg:px-6">
        <p className="max-w-3xl leading-relaxed">{t("governanceBanner", lang)}</p>
        <p className="mt-4">
          {t("dataYear", lang)} <span className="tabular-nums">{REFERENCE_YEAR}</span> ·{" "}
          {t("sourceLabel", lang)}:{" "}
          {SOURCES.map((source, index) => (
            <span key={source.id}>
              {index > 0 && " · "}
              <a
                className="font-medium text-flare underline"
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                {bi(source.title, lang)}
              </a>
            </span>
          ))}
        </p>
        <p className="mt-4">
          {t("pointProfileNote", lang)} Basemap © OpenStreetMap contributors.
        </p>
      </div>
    </footer>
  );
}
