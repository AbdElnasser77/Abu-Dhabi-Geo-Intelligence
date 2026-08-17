/**
 * Official emirate and regional figures.
 *
 * Sources: `reference/05_Official_Emirate_Demographics.md` and
 * `reference/14_website_seed_data.json`. These are the ONLY `official` numbers
 * in the product — everything at locality level is `qualitative`.
 *
 * Reference year 2024. `reference/05` carries a standing instruction: check
 * SCAD for a newer release before every deployment and never silently mix years.
 */

import type { Bilingual, DataStatus, PurchasingPower, RegionId } from "@/lib/taxonomy";

export const REFERENCE_YEAR = 2024;

export type SourceId = "scad_2024_population" | "scad_census_population" | "scad_portal";

export type Source = {
  readonly id: SourceId;
  readonly publisher: Bilingual;
  readonly title: Bilingual;
  readonly url: string;
};

export const SOURCES: readonly Source[] = [
  {
    id: "scad_2024_population",
    publisher: { en: "Statistics Centre – Abu Dhabi (SCAD)", ar: "مركز الإحصاء – أبوظبي" },
    title: {
      en: "Abu Dhabi population in 2024 grows 7.5% to reach 4.14m",
      ar: "نمو سكان أبوظبي في 2024 بنسبة 7.5% ليصل إلى 4.14 مليون",
    },
    url: "https://scad.gov.ae/ar/w/abu-dhabi-population-in-2024-grows-7-5-to-reach-4-14m",
  },
  {
    id: "scad_census_population",
    publisher: { en: "Statistics Centre – Abu Dhabi (SCAD)", ar: "مركز الإحصاء – أبوظبي" },
    title: { en: "SCAD Census population portal", ar: "بوابة سكان التعداد" },
    url: "https://census.scad.gov.ae/home/population",
  },
  {
    id: "scad_portal",
    publisher: { en: "Statistics Centre – Abu Dhabi (SCAD)", ar: "مركز الإحصاء – أبوظبي" },
    title: {
      en: "SCAD portal and statistical publications catalogue",
      ar: "بوابة المركز وكتالوج المنشورات الإحصائية",
    },
    url: "https://scad.gov.ae",
  },
];

const BY_SOURCE_ID = new Map(SOURCES.map((s) => [s.id, s]));

export function sourceById(id: SourceId): Source {
  const found = BY_SOURCE_ID.get(id);
  if (!found) throw new Error(`Unknown source id: ${id}`);
  return found;
}

export const EMIRATE = {
  id: "abu_dhabi_emirate",
  name: { en: "Emirate of Abu Dhabi", ar: "إمارة أبوظبي" } as Bilingual,
  population: 4_135_985,
  status: "official" as DataStatus,
  sourceId: "scad_2024_population" as SourceId,
} as const;

export type Region = {
  readonly id: RegionId;
  readonly name: Bilingual;
  readonly population: number;
  /** Percentage share of the emirate total. */
  readonly share: number;
  readonly status: DataStatus;
  readonly sourceId: SourceId;
  /**
   * Named fields rather than a tuple on purpose: the seed JSON stores these as
   * [lat, lng] while MapLibre expects [lng, lat], and that silent mismatch is
   * exactly the kind of bug that puts Al Ain in the Indian Ocean.
   */
  readonly center: { readonly lng: number; readonly lat: number };
  readonly zoom: number;
  readonly reading: Bilingual;
};

export const REGIONS: readonly Region[] = [
  {
    id: "abu_dhabi",
    name: { en: "Abu Dhabi Region", ar: "منطقة أبوظبي" },
    population: 2_823_340,
    share: 68.2,
    status: "official",
    sourceId: "scad_2024_population",
    center: { lng: 54.3667, lat: 24.4667 },
    zoom: 10,
    reading: {
      en: "Largest urban, workforce, premium and mixed-density market.",
      ar: "أكبر سوق حضري وعمالي ومتميز ومتعدد الكثافات.",
    },
  },
  {
    id: "al_ain",
    name: { en: "Al Ain Region", ar: "منطقة العين" },
    population: 986_910,
    share: 23.9,
    status: "official",
    sourceId: "scad_2024_population",
    center: { lng: 55.7447, lat: 24.2075 },
    zoom: 10,
    reading: {
      en: "Major family and citizen-oriented inland market.",
      ar: "سوق داخلي رئيسي موجّه للعائلات والمواطنين.",
    },
  },
  {
    id: "al_dhafra",
    name: { en: "Al Dhafra Region", ar: "منطقة الظفرة" },
    population: 325_735,
    share: 7.9,
    status: "official",
    sourceId: "scad_2024_population",
    center: { lng: 53.2, lat: 23.65 },
    zoom: 7,
    reading: {
      en: "Smaller dispersed market with energy, industrial and local-community clusters.",
      ar: "سوق أصغر ومتفرق يضم تجمعات للطاقة والصناعة والمجتمعات المحلية.",
    },
  },
];

const BY_REGION_ID = new Map(REGIONS.map((r) => [r.id, r]));

export function regionById(id: RegionId): Region {
  const found = BY_REGION_ID.get(id);
  if (!found) throw new Error(`Unknown region id: ${id}`);
  return found;
}

/** Emirate-wide view: whole-emirate framing used when no region is selected. */
export const EMIRATE_VIEW = {
  center: { lng: 54.0, lat: 24.0 },
  zoom: 7,
} as const;

export type HeadlineMetric = {
  readonly key: string;
  readonly label: Bilingual;
  readonly value: number;
  readonly unit: "people" | "percent" | "years" | "units";
  readonly status: DataStatus;
  /** True where `reference/05` marks the figure as a rounded headline. */
  readonly approximate: boolean;
  readonly sourceId: SourceId;
};

export const HEADLINE_METRICS: readonly HeadlineMetric[] = [
  {
    key: "male",
    label: { en: "Male population", ar: "السكان الذكور" },
    value: 2_767_060,
    unit: "people",
    status: "official",
    approximate: false,
    sourceId: "scad_2024_population",
  },
  {
    key: "female",
    label: { en: "Female population", ar: "السكان الإناث" },
    value: 1_368_925,
    unit: "people",
    status: "official",
    approximate: false,
    sourceId: "scad_2024_population",
  },
  {
    key: "working_age",
    label: { en: "Working age 15–64", ar: "سن العمل 15–64" },
    value: 84,
    unit: "percent",
    status: "official",
    approximate: true,
    sourceId: "scad_2024_population",
  },
  {
    key: "age_25_44",
    label: { en: "Age 25–44", ar: "الفئة العمرية 25–44" },
    value: 54,
    unit: "percent",
    status: "official",
    approximate: true,
    sourceId: "scad_2024_population",
  },
  {
    key: "median_age",
    label: { en: "Median age", ar: "العمر الوسيط" },
    value: 33,
    unit: "years",
    status: "official",
    approximate: true,
    sourceId: "scad_2024_population",
  },
  {
    key: "employed",
    label: { en: "Employed population", ar: "السكان العاملون" },
    value: 2_762_715,
    unit: "people",
    status: "official",
    approximate: false,
    sourceId: "scad_2024_population",
  },
  {
    key: "white_collar",
    label: { en: "White-collar share", ar: "نسبة الوظائف المكتبية" },
    value: 44.8,
    unit: "percent",
    status: "official",
    approximate: false,
    sourceId: "scad_2024_population",
  },
  {
    key: "blue_collar",
    label: { en: "Blue-collar share", ar: "نسبة الوظائف المهنية" },
    value: 55.2,
    unit: "percent",
    status: "official",
    approximate: false,
    sourceId: "scad_2024_population",
  },
  {
    key: "real_estate_units",
    label: { en: "Total real-estate units", ar: "إجمالي الوحدات العقارية" },
    value: 783_970,
    unit: "units",
    status: "official",
    approximate: false,
    sourceId: "scad_2024_population",
  },
  {
    key: "residential_units",
    label: { en: "Residential units", ar: "الوحدات السكنية" },
    value: 466_700,
    unit: "units",
    status: "official",
    approximate: false,
    sourceId: "scad_2024_population",
  },
];

/**
 * Purchasing-power legend colours, verbatim from
 * `reference/14_website_seed_data.json`.
 */
export const PP_COLORS: Record<PurchasingPower, string> = {
  1: "#B91C1C",
  2: "#EA580C",
  3: "#C99A2E",
  4: "#16865B",
  5: "#064E3B",
};

/**
 * The caveat that must accompany every locality profile
 * (`reference/05` "Nationality granularity caveat").
 */
export const DISTRICT_POPULATION_CAVEAT: Bilingual = {
  en: "No official district-level population or nationality count is published for this area. Region totals above are official; the segment and purchasing-power profile below is a qualitative planning input.",
  ar: "لا يوجد عدد رسمي منشور للسكان أو الجنسيات على مستوى هذه المنطقة. إجماليات المنطقة الإحصائية أعلاه رسمية، أما ملف القطاعات والقوة الشرائية أدناه فهو مُدخل تخطيطي نوعي.",
};
