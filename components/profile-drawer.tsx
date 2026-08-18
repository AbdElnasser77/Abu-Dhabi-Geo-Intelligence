"use client";

import { useId, useState } from "react";

import { ConfidenceBadge } from "@/components/confidence-badge";
import { ppFill, ppText } from "@/lib/colors";
import type { Area } from "@/lib/data/areas";
import {
  DISTRICT_POPULATION_CAVEAT,
  EMIRATE,
  REFERENCE_YEAR,
  SOURCES,
  regionById,
} from "@/lib/data/emirate";
import { profilesForSegments } from "@/lib/data/segments";
import { PP_COMPONENTS, bi, formatCoord, formatNumber, formatPercent, t } from "@/lib/i18n";
import {
  CATEGORY_LABELS,
  DENSITY_LABELS,
  LANGUAGE_LABELS,
  PP_INTERPRETATION,
  PP_LABELS,
  SEGMENT_LABELS,
  TYPE_CODE_LABELS,
  type Lang,
} from "@/lib/taxonomy";

/**
 * The seven-tab area profile from `reference/09` "Profile tabs".
 *
 * The Demographics tab deliberately contains no locality figure. `reference/05`
 * forbids one — there is no published district-level population or nationality
 * count — so it states the reason and offers the official region total as
 * context instead. `reference/09`: replace "N/A" with a reason.
 */

const TAB_KEYS = [
  "tabOverview",
  "tabDemographics",
  "tabLanguages",
  "tabPp",
  "tabBuilt",
  "tabOpportunities",
  "tabSources",
] as const;

type TabKey = (typeof TAB_KEYS)[number];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-hairline py-2 first:border-t-0">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-ink">{children}</dd>
    </div>
  );
}

function NotPublished({ lang }: { lang: Lang }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm italic text-ink-muted">
      {t("notPublished", lang)}
    </span>
  );
}

function TagList({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-1">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-hairline bg-raised px-2 py-0.5 text-xs text-ink"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ProfileDrawer({
  area,
  lang,
  onClose,
}: {
  area: Area;
  lang: Lang;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<TabKey>("tabOverview");
  const baseId = useId();
  const region = regionById(area.region);
  const matrix = profilesForSegments(area.segments);

  const canonicalLanguages = area.languages.map((id) => bi(LANGUAGE_LABELS[id], lang));
  const canonicalSegments = area.segments.map((id) => bi(SEGMENT_LABELS[id], lang));

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <div className="border-b border-hairline p-4">
        <div className="flex items-start justify-between gap-3">
          <nav aria-label="breadcrumb" className="text-[11px] text-ink-muted">
            {t("emirate", lang)} <span aria-hidden="true">›</span>{" "}
            {bi(region.name, lang)} <span aria-hidden="true">›</span>{" "}
            <span className="font-medium text-ink">
              {lang === "ar" ? area.nameAr : area.nameEn}
            </span>
          </nav>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("closeProfile", lang)}
            className="grid size-8 shrink-0 place-items-center rounded-md border border-hairline text-ink-muted hover:border-uae-red hover:text-uae-red"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <h2 className="mt-2 text-lg font-semibold leading-tight text-ink">
          {lang === "ar" ? area.nameAr : area.nameEn}
        </h2>
        <p className="text-sm text-ink-muted" dir={lang === "ar" ? "ltr" : "rtl"}>
          {lang === "ar" ? area.nameEn : area.nameAr}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className="grid size-8 place-items-center rounded-full border-2 border-white text-sm font-bold shadow"
            style={{ backgroundColor: ppFill(area.pp), color: ppText(area.pp) }}
            aria-hidden="true"
          >
            {area.pp}
          </span>
          <span className="text-xs font-medium text-ink">
            {t("purchasingPower", lang)} {area.pp}/5 · {bi(PP_LABELS[area.pp], lang)}
          </span>
          <ConfidenceBadge status={area.dataStatus} lang={lang} size="sm" />
        </div>
      </div>

      <div
        role="tablist"
        aria-label={t("directory", lang)}
        className="flex shrink-0 gap-1 overflow-x-auto border-b border-hairline bg-raised px-2 py-1.5"
      >
        {TAB_KEYS.map((key) => (
          <button
            key={key}
            id={`${baseId}-tab-${key}`}
            role="tab"
            type="button"
            aria-selected={tab === key}
            aria-controls={`${baseId}-panel-${key}`}
            tabIndex={tab === key ? 0 : -1}
            onClick={() => setTab(key)}
            className={[
              "shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              tab === key
                ? "bg-flare text-flare-ink"
                : "text-ink hover:bg-surface hover:text-flare",
            ].join(" ")}
          >
            {t(key, lang)}
          </button>
        ))}
      </div>

      <div
        id={`${baseId}-panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${tab}`}
        tabIndex={0}
        className="min-h-0 flex-1 overflow-y-auto p-4"
      >
        {tab === "tabOverview" && (
          <dl>
            <Field label={t("parentRegion", lang)}>{bi(region.name, lang)}</Field>
            <Field label={t("areaTypeLabel", lang)}>{bi(area.areaType, lang)}</Field>
            <Field label={t("typeCodeLabel", lang)}>
              {area.typeCode} · {bi(TYPE_CODE_LABELS[area.typeCode], lang)}
            </Field>
            <Field label={t("areaCategory", lang)}>
              {bi(CATEGORY_LABELS[area.category], lang)}
            </Field>
            <Field label={t("densityProfileLabel", lang)}>
              {bi(area.densityProfile, lang)}
            </Field>
            <Field label={t("coordinates", lang)}>
              <span dir="ltr" className="font-mono text-xs tabular-nums">
                {formatCoord(area.lat)}, {formatCoord(area.lng)}
              </span>
              <span className="ms-2 text-[11px] text-ink-muted">WGS84 / EPSG:4326</span>
            </Field>
            <Field label={t("synopsis", lang)}>{bi(area.notes, lang)}</Field>
          </dl>
        )}

        {tab === "tabDemographics" && (
          <div className="flex flex-col gap-3">
            <p className="rounded-lg border border-gold/40 bg-gold/10 px-3 py-2.5 text-xs leading-relaxed text-ink">
              {bi(DISTRICT_POPULATION_CAVEAT, lang)}
            </p>
            <dl>
              <Field label={t("populationLabel", lang)}>
                <NotPublished lang={lang} />
              </Field>
              <Field label={t("regionTotalContext", lang)}>
                <span className="tabular-nums">{formatNumber(region.population, lang)}</span>
                <span className="ms-2 text-[11px] text-ink-muted">
                  {formatPercent(region.share, lang)}% {t("shareOfEmirate", lang)}
                </span>
                <span className="ms-2 inline-block align-middle">
                  <ConfidenceBadge status={region.status} lang={lang} size="sm" />
                </span>
              </Field>
              <Field label={t("emirateTotal", lang)}>
                <span className="tabular-nums">{formatNumber(EMIRATE.population, lang)}</span>
                <span className="ms-2 inline-block align-middle">
                  <ConfidenceBadge status={EMIRATE.status} lang={lang} size="sm" />
                </span>
              </Field>
            </dl>
          </div>
        )}

        {tab === "tabLanguages" && (
          <div className="flex flex-col gap-3">
            <dl>
              <Field label={t("priorityLanguages", lang)}>
                <TagList items={canonicalLanguages} />
              </Field>
              <Field label={t("asPublished", lang)}>
                <span dir="ltr" className="text-xs text-ink-muted">
                  {area.rawLanguages.join("; ")}
                </span>
              </Field>
              <Field label={t("communitySegments", lang)}>
                <TagList items={canonicalSegments} />
              </Field>
              <Field label={t("asPublished", lang)}>
                <span dir="ltr" className="text-xs text-ink-muted">
                  {area.rawSegments.join("; ")}
                </span>
              </Field>
              <Field label={t("evidenceLevel", lang)}>
                <ConfidenceBadge status={area.dataStatus} lang={lang} size="sm" />
              </Field>
            </dl>

            {matrix.length > 0 && (
              <div className="border-t border-hairline pt-3">
                <p className="mb-2 text-[11px] leading-snug text-ink-muted">
                  {t("opportunitiesIntro", lang)}
                </p>
                <ul className="flex flex-col gap-2">
                  {matrix.map((profile) => (
                    <li
                      key={profile.key}
                      className="rounded-lg border border-hairline bg-raised/60 p-2.5"
                    >
                      <p className="text-sm font-semibold text-ink">
                        {bi(profile.name, lang)}
                      </p>
                      <p className="mt-1 text-xs text-ink">
                        <span className="font-medium">{t("priorityLanguages", lang)}: </span>
                        {bi(profile.priorityLanguages, lang)}
                      </p>
                      {profile.secondaryLanguages && (
                        <p className="text-xs text-ink-muted">
                          <span className="font-medium">
                            {t("secondaryLanguages", lang)}:{" "}
                          </span>
                          {bi(profile.secondaryLanguages, lang)}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {tab === "tabPp" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 rounded-lg border border-hairline p-3">
              <span
                className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-white text-xl font-bold shadow"
                style={{ backgroundColor: ppFill(area.pp), color: ppText(area.pp) }}
                aria-hidden="true"
              >
                {area.pp}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">
                  {area.pp} {t("ppOutOf", lang)} · {bi(PP_LABELS[area.pp], lang)}
                </p>
                <p className="text-xs text-ink-muted">{t("ppScore", lang)}</p>
              </div>
            </div>

            <dl>
              <Field label={t("ppInterpretation", lang)}>
                {bi(PP_INTERPRETATION[area.pp], lang)}
              </Field>
            </dl>

            <div className="border-t border-hairline pt-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                {t("ppComponentsTitle", lang)}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-ink-muted">
                {t("ppComponentsNote", lang)}
              </p>
              <table className="mt-2 w-full text-xs">
                <thead>
                  <tr className="text-start text-ink-muted">
                    <th scope="col" className="py-1 text-start font-medium">
                      {t("component", lang)}
                    </th>
                    <th scope="col" className="py-1 text-end font-medium">
                      {t("weight", lang)}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PP_COMPONENTS.map((component) => (
                    <tr key={component.name.en} className="border-t border-hairline">
                      <td className="py-1.5 pe-2">
                        <span className="text-ink">{bi(component.name, lang)}</span>
                        <span className="block text-[11px] text-ink-muted">
                          {bi(component.evidence, lang)}
                        </span>
                      </td>
                      <td className="py-1.5 text-end font-medium tabular-nums text-ink">
                        {component.weight}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="rounded-lg border border-uae-red/30 bg-uae-red/10 px-3 py-2 text-[11px] leading-relaxed text-ink">
              {t("ppEthics", lang)}
            </p>
            <p className="text-[11px] leading-relaxed text-ink-muted">
              {t("residentVsDaytime", lang)}
            </p>
          </div>
        )}

        {tab === "tabBuilt" && (
          <dl>
            <Field label={t("areaTypeLabel", lang)}>{bi(area.areaType, lang)}</Field>
            <Field label={t("typeCodeLabel", lang)}>
              {area.typeCode} · {bi(TYPE_CODE_LABELS[area.typeCode], lang)}
            </Field>
            <Field label={t("densityProfileLabel", lang)}>
              {bi(area.densityProfile, lang)}
              <span className="ms-2 text-[11px] text-ink-muted">
                ({t("density", lang)}: {bi(DENSITY_LABELS[area.density], lang)} —{" "}
                {t("densityDerived", lang)})
              </span>
            </Field>
            <Field label={t("populationLabel", lang)}>
              <NotPublished lang={lang} />
            </Field>
          </dl>
        )}

        {tab === "tabOpportunities" && (
          <div className="flex flex-col gap-3">
            <p className="text-[11px] leading-snug text-ink-muted">
              {t("opportunitiesIntro", lang)}
            </p>
            {matrix.length === 0 ? (
              <p className="rounded-lg bg-raised px-3 py-2 text-xs text-ink-muted">
                {t("noSegmentGuidance", lang)}
              </p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {matrix.map((profile) => (
                  <li key={profile.key} className="rounded-lg border border-hairline p-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-ink">
                        {bi(profile.name, lang)}
                      </p>
                      <span className="text-[11px] tabular-nums text-ink-muted">
                        {t("ppRangeLabel", lang)}: {profile.ppRange.min}–{profile.ppRange.max}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ink-muted">{bi(profile.importance, lang)}</p>
                    <p className="mt-1.5 text-xs text-ink">
                      <span className="font-medium">
                        {t("highValueSubsegments", lang)}:{" "}
                      </span>
                      {bi(profile.highValueSubsegments, lang)}
                    </p>
                    <p className="mt-1 text-xs text-ink">
                      <span className="font-medium">{t("marketingGuidance", lang)}: </span>
                      {bi(profile.guidance, lang)}
                    </p>
                    <p className="mt-1.5 rounded-md bg-gold/10 px-2 py-1.5 text-[11px] leading-snug text-ink">
                      <span className="font-semibold">{t("dataCaution", lang)}: </span>
                      {bi(profile.caution, lang)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "tabSources" && (
          <div className="flex flex-col gap-3">
            <p className="text-[11px] leading-snug text-ink-muted">
              {t("sourcesIntro", lang)}
            </p>
            <dl>
              <Field label={t("dataStatusLabel", lang)}>
                <ConfidenceBadge status={area.dataStatus} lang={lang} size="sm" />
              </Field>
              <Field label={t("dataYear", lang)}>
                <span className="tabular-nums">{REFERENCE_YEAR}</span>
              </Field>
              <Field label={t("asPublishedSegments", lang)}>
                <span dir="ltr" className="text-xs text-ink-muted">
                  {area.rawSegments.join("; ")} — {area.rawLanguages.join("; ")}
                </span>
              </Field>
              <Field label={t("normalisedTags", lang)}>
                <TagList items={[...canonicalSegments, ...canonicalLanguages]} />
              </Field>
            </dl>
            <ul className="flex flex-col gap-2 border-t border-hairline pt-3">
              {SOURCES.map((source) => (
                <li key={source.id} className="rounded-lg border border-hairline p-2.5">
                  <p className="text-xs font-semibold text-ink">{bi(source.title, lang)}</p>
                  <p className="text-[11px] text-ink-muted">{bi(source.publisher, lang)}</p>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-[11px] font-medium text-flare underline"
                  >
                    {t("openSource", lang)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
