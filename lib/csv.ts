/**
 * CSV export of the active result set.
 *
 * `reference/15 §6` requires: UTF-8 with BOM so Arabic opens correctly in Excel,
 * correct escaping, only current-query records, and the filename
 * `abu-dhabi-filtered-areas-YYYY-MM-DD.csv`.
 *
 * Columns follow `reference/15 §5`: bilingual area name, region, category, area
 * type and density, languages, community segments, purchasing-power score, and
 * data status with reference year.
 */

import type { Area } from "@/lib/data/areas";
import { REFERENCE_YEAR } from "@/lib/data/emirate";
import { bi } from "@/lib/i18n";
import {
  CATEGORY_LABELS,
  DATA_STATUS_LABELS,
  LANGUAGE_LABELS,
  PP_LABELS,
  REGION_LABELS,
  SEGMENT_LABELS,
  type Lang,
} from "@/lib/taxonomy";

/** Excel and Numbers both need the BOM to detect UTF-8 in a .csv. */
const BOM = "﻿";
/** CRLF is what Excel expects; LF alone breaks multi-line cells on Windows. */
const EOL = "\r\n";

function cell(value: string | number): string {
  const text = String(value);
  // Quote everything and double any embedded quote. Simpler than deciding
  // per-value, and immune to commas and semicolons inside Arabic text.
  return `"${text.replace(/"/g, '""')}"`;
}

const HEADERS: Record<Lang, readonly string[]> = {
  en: [
    "area_id",
    "name_en",
    "name_ar",
    "region_en",
    "region_ar",
    "category",
    "area_type",
    "density_profile",
    "taxonomy_code",
    "latitude",
    "longitude",
    "purchasing_power_score",
    "purchasing_power_label",
    "priority_languages",
    "community_segments",
    "priority_languages_as_published",
    "community_segments_as_published",
    "data_status",
    "reference_year",
    "notes",
  ],
  ar: [
    "معرف_المنطقة",
    "الاسم_بالإنجليزية",
    "الاسم_بالعربية",
    "المنطقة_بالإنجليزية",
    "المنطقة_بالعربية",
    "الفئة",
    "نوع_المنطقة",
    "ملف_الكثافة",
    "رمز_التصنيف",
    "خط_العرض",
    "خط_الطول",
    "درجة_القوة_الشرائية",
    "وصف_القوة_الشرائية",
    "اللغات_ذات_الأولوية",
    "قطاعات_المجتمع",
    "اللغات_كما_نشرت",
    "القطاعات_كما_نشرت",
    "حالة_البيانات",
    "سنة_الإسناد",
    "ملاحظات",
  ],
};

function row(area: Area, lang: Lang): string {
  const values: (string | number)[] = [
    area.id,
    area.nameEn,
    area.nameAr,
    REGION_LABELS[area.region].en,
    REGION_LABELS[area.region].ar,
    bi(CATEGORY_LABELS[area.category], lang),
    bi(area.areaType, lang),
    bi(area.densityProfile, lang),
    area.typeCode,
    area.lat,
    area.lng,
    area.pp,
    bi(PP_LABELS[area.pp], lang),
    area.languages.map((l) => bi(LANGUAGE_LABELS[l], lang)).join("; "),
    area.segments.map((s) => bi(SEGMENT_LABELS[s], lang)).join("; "),
    area.rawLanguages.join("; "),
    area.rawSegments.join("; "),
    bi(DATA_STATUS_LABELS[area.dataStatus], lang),
    REFERENCE_YEAR,
    bi(area.notes, lang),
  ];
  return values.map(cell).join(",");
}

export function buildCsv(areas: readonly Area[], lang: Lang): string {
  const lines = [
    HEADERS[lang].map(cell).join(","),
    ...areas.map((area) => row(area, lang)),
  ];
  return BOM + lines.join(EOL) + EOL;
}

export function csvFilename(now: Date = new Date()): string {
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `abu-dhabi-filtered-areas-${yyyy}-${mm}-${dd}.csv`;
}

/** Triggers the download. Browser-only. */
export function downloadCsv(areas: readonly Area[], lang: Lang): void {
  const blob = new Blob([buildCsv(areas, lang)], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = csvFilename();
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Give the browser a tick to start the download before revoking.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
