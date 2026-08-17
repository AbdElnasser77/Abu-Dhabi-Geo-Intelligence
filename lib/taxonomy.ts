/**
 * Canonical filter vocabularies for the Abu Dhabi Geo-Intelligence workspace.
 *
 * The seed CSV (`reference/06_City_District_Demographic_Profiles.csv`) stores
 * segments and languages as free text, so they must be normalised into stable
 * tags before OR-within-a-dimension matching can work. Every normalisation
 * decision is recorded here rather than inline at the call site, because these
 * are transforms on governed data and have to stay reviewable.
 */

export type Lang = "en" | "ar";

/** A label that exists in both interface languages. */
export type Bilingual = { readonly en: string; readonly ar: string };

// ---------------------------------------------------------------------------
// Regions — Level 1 statistical regions (reference/04)
// ---------------------------------------------------------------------------

export type RegionId = "abu_dhabi" | "al_ain" | "al_dhafra";

export const REGION_IDS: readonly RegionId[] = ["abu_dhabi", "al_ain", "al_dhafra"];

export const REGION_LABELS: Record<RegionId, Bilingual> = {
  abu_dhabi: { en: "Abu Dhabi Region", ar: "منطقة أبوظبي" },
  al_ain: { en: "Al Ain Region", ar: "منطقة العين" },
  al_dhafra: { en: "Al Dhafra Region", ar: "منطقة الظفرة" },
};

// ---------------------------------------------------------------------------
// Area category — the controlled taxonomy named in reference/15 §2
// ---------------------------------------------------------------------------

export type CategoryId =
  | "premium"
  | "family"
  | "mixed"
  | "industrial"
  | "operations"
  | "oasis_island";

export const CATEGORY_IDS: readonly CategoryId[] = [
  "premium",
  "family",
  "mixed",
  "industrial",
  "operations",
  "oasis_island",
];

export const CATEGORY_LABELS: Record<CategoryId, Bilingual> = {
  premium: { en: "Premium", ar: "متميز" },
  family: { en: "Family", ar: "عائلي" },
  mixed: { en: "Mixed", ar: "مختلط" },
  industrial: { en: "Industrial", ar: "صناعي" },
  operations: { en: "Operations", ar: "تشغيلي" },
  oasis_island: { en: "Oasis / Island", ar: "واحات وجزر" },
};

// ---------------------------------------------------------------------------
// Area-type vocabulary — reference/04 "Area-type vocabulary" table.
// Kept alongside `category` so the source's own coding is never lost.
// ---------------------------------------------------------------------------

export type TypeCode = "CBD" | "WFT" | "VIL" | "APT" | "MIX" | "IND" | "ENG" | "RUR" | "ISL";

export const TYPE_CODE_LABELS: Record<TypeCode, Bilingual> = {
  CBD: { en: "Central business / urban core", ar: "نواة حضرية ومركز أعمال" },
  WFT: { en: "Waterfront / lifestyle", ar: "واجهة مائية ونمط حياة" },
  VIL: { en: "Villa / family suburb", ar: "فلل وضواحٍ عائلية" },
  APT: { en: "High-density apartment district", ar: "منطقة شقق عالية الكثافة" },
  MIX: { en: "Mixed-use city / district", ar: "منطقة متعددة الاستخدامات" },
  IND: { en: "Industrial / workforce", ar: "صناعي وقوى عاملة" },
  ENG: { en: "Energy / company town", ar: "مدينة شركات الطاقة" },
  RUR: { en: "Oasis / rural / dispersed", ar: "واحات وريفي ومتفرق" },
  ISL: { en: "Island community", ar: "مجتمع جزري" },
};

// ---------------------------------------------------------------------------
// Languages — the filter vocabulary listed in reference/15 §2.
//
// NORMALISATION: the CSV writes "Hindi/Urdu" for most rows but bare "Hindi"
// for Al Maryah, Yas, Al Raha, Khalifa City and Ruwais. The spec's own filter
// vocabulary offers a single "Hindi/Urdu" option, so all three spellings
// collapse to `hindi_urdu`.
// ---------------------------------------------------------------------------

export type LanguageId =
  | "arabic"
  | "english"
  | "hindi_urdu"
  | "malayalam"
  | "tagalog"
  | "bengali"
  | "nepali"
  | "russian";

export const LANGUAGE_IDS: readonly LanguageId[] = [
  "arabic",
  "english",
  "hindi_urdu",
  "malayalam",
  "tagalog",
  "bengali",
  "nepali",
  "russian",
];

export const LANGUAGE_LABELS: Record<LanguageId, Bilingual> = {
  arabic: { en: "Arabic", ar: "العربية" },
  english: { en: "English", ar: "الإنجليزية" },
  hindi_urdu: { en: "Hindi / Urdu", ar: "الهندية والأردية" },
  malayalam: { en: "Malayalam", ar: "المالايالامية" },
  tagalog: { en: "Tagalog", ar: "التاغالوغية" },
  bengali: { en: "Bengali", ar: "البنغالية" },
  nepali: { en: "Nepali", ar: "النيبالية" },
  russian: { en: "Russian", ar: "الروسية" },
};

// ---------------------------------------------------------------------------
// Community / nationality segments.
//
// NORMALISATION decisions:
//  - "Arab", "Arab expatriate" and "Arab workers" -> `arab`.
//  - "Indian" and "Indian professional" -> `indian`.
//  - "Western", "International executives" and "International engineers" ->
//    `western` (all denote internationally-recruited professional cohorts).
//  - "South Asian", "Asian" and "Asian professional" -> `asian`. The source
//    itself uses these umbrella terms; narrowing them to a single nationality
//    would invent precision the data does not carry.
//  - "agricultural workforce" and "service workforce" -> `workforce`.
//  - `hnwi`, `diplomatic`, `russian_speaking`, `african` and `visitors` stay
//    distinct because the source names them distinctly.
// ---------------------------------------------------------------------------

export type SegmentId =
  | "emirati"
  | "arab"
  | "indian"
  | "pakistani"
  | "bangladeshi"
  | "nepali"
  | "filipino"
  | "asian"
  | "western"
  | "russian_speaking"
  | "african"
  | "hnwi"
  | "diplomatic"
  | "workforce"
  | "visitors";

export const SEGMENT_IDS: readonly SegmentId[] = [
  "emirati",
  "arab",
  "indian",
  "pakistani",
  "bangladeshi",
  "nepali",
  "filipino",
  "asian",
  "western",
  "russian_speaking",
  "african",
  "hnwi",
  "diplomatic",
  "workforce",
  "visitors",
];

export const SEGMENT_LABELS: Record<SegmentId, Bilingual> = {
  emirati: { en: "Emirati", ar: "إماراتيون" },
  arab: { en: "Arab", ar: "عرب" },
  indian: { en: "Indian", ar: "هنود" },
  pakistani: { en: "Pakistani", ar: "باكستانيون" },
  bangladeshi: { en: "Bangladeshi", ar: "بنغلاديشيون" },
  nepali: { en: "Nepali", ar: "نيباليون" },
  filipino: { en: "Filipino", ar: "فلبينيون" },
  asian: { en: "Asian / South Asian", ar: "آسيويون وجنوب آسيويون" },
  western: { en: "Western / international", ar: "غربيون ودوليون" },
  russian_speaking: { en: "Russian-speaking", ar: "ناطقون بالروسية" },
  african: { en: "African", ar: "أفارقة" },
  hnwi: { en: "High-net-worth", ar: "أصحاب ثروات عالية" },
  diplomatic: { en: "Diplomatic", ar: "السلك الدبلوماسي" },
  workforce: { en: "Workforce", ar: "قوى عاملة" },
  visitors: { en: "Visitors", ar: "زوار" },
};

// ---------------------------------------------------------------------------
// Density.
//
// The CSV's `density_profile` column is heterogeneous free text — several
// values ("Premium family market", "Established families") are not density
// statements at all. These five buckets are therefore a DERIVED planning
// classification used only for filtering; the verbatim source text is always
// what gets displayed. The filter is labelled "derived" in the UI for that
// reason.
// ---------------------------------------------------------------------------

export type DensityId = "very_high" | "high" | "medium" | "low" | "dispersed";

export const DENSITY_IDS: readonly DensityId[] = [
  "very_high",
  "high",
  "medium",
  "low",
  "dispersed",
];

export const DENSITY_LABELS: Record<DensityId, Bilingual> = {
  very_high: { en: "Very high", ar: "مرتفعة جداً" },
  high: { en: "High", ar: "مرتفعة" },
  medium: { en: "Medium", ar: "متوسطة" },
  low: { en: "Low", ar: "منخفضة" },
  dispersed: { en: "Dispersed", ar: "متفرقة" },
};

// ---------------------------------------------------------------------------
// Data status — the six confidence labels from reference/00 and reference/12.
// Every displayed measure must carry one of these.
// ---------------------------------------------------------------------------

export type DataStatus =
  | "official"
  | "calculated"
  | "indicative"
  | "modeled"
  | "qualitative"
  | "unavailable";

export const DATA_STATUS_IDS: readonly DataStatus[] = [
  "official",
  "calculated",
  "indicative",
  "modeled",
  "qualitative",
  "unavailable",
];

export const DATA_STATUS_LABELS: Record<DataStatus, Bilingual> = {
  official: { en: "Official", ar: "رسمي" },
  calculated: { en: "Calculated", ar: "محتسب" },
  indicative: { en: "Indicative", ar: "استدلالي" },
  modeled: { en: "Modeled", ar: "مُنمذج" },
  qualitative: { en: "Qualitative", ar: "نوعي" },
  unavailable: { en: "Unavailable", ar: "غير متوفر" },
};

/** How reference/12 says each status must be explained to the reader. */
export const DATA_STATUS_MEANING: Record<DataStatus, Bilingual> = {
  official: {
    en: "Directly published statistic, shown with its source.",
    ar: "إحصاء منشور مباشرة، ويُعرض مع مصدره.",
  },
  calculated: {
    en: "Arithmetic derived from an official statistic.",
    ar: "ناتج حسابي مستمد من إحصاء رسمي.",
  },
  indicative: {
    en: "Supported by a credible external source, but not an official count.",
    ar: "مدعوم بمصدر خارجي موثوق، لكنه ليس عدداً رسمياً.",
  },
  modeled: {
    en: "Planning estimate produced by a documented method.",
    ar: "تقدير تخطيطي ناتج عن منهجية موثقة.",
  },
  qualitative: {
    en: "Observed segment mix with no count attached. Descriptive ranking only.",
    ar: "مزيج قطاعات مُلاحظ دون عدد. ترتيب وصفي فقط.",
  },
  unavailable: {
    en: "Not published at the required level of geographic detail.",
    ar: "غير منشور بمستوى التفصيل الجغرافي المطلوب.",
  },
};

// ---------------------------------------------------------------------------
// Thematic map layers — the numbered "intelligence layer" rail.
//
// Five of the six the reference implementation shows are backed by real columns:
// purchasing power, the primary nationality segment, the primary language, and
// housing form. `population` and `healthcare` are listed but NOT selectable —
// there is no published district-level population and no facility/POI source is
// connected. They render disabled with the reason attached, because fabricating
// them would break the governance rule the whole package rests on.
// ---------------------------------------------------------------------------

export type ThematicLayer =
  | "population"
  | "pp"
  | "nationality"
  | "language"
  | "housing"
  | "healthcare"
  | "confidence";

export const THEMATIC_LAYERS: readonly ThematicLayer[] = [
  "population",
  "pp",
  "nationality",
  "language",
  "housing",
  "healthcare",
  "confidence",
];

export const THEMATIC_LAYER_LABELS: Record<ThematicLayer, Bilingual> = {
  population: { en: "Population", ar: "عدد السكان" },
  pp: { en: "Purchasing power", ar: "القوة الشرائية" },
  nationality: { en: "Nationalities", ar: "الجنسيات" },
  language: { en: "Languages", ar: "اللغات" },
  housing: { en: "Housing", ar: "الإسكان" },
  healthcare: { en: "Healthcare opportunity", ar: "فرص الرعاية الصحية" },
  confidence: { en: "Data confidence", ar: "مستوى الثقة" },
};

export const LAYER_AVAILABLE: Record<ThematicLayer, boolean> = {
  population: false,
  pp: true,
  nationality: true,
  language: true,
  housing: true,
  healthcare: false,
  confidence: true,
};

/** Shown on the disabled entries so the gap is traceable to missing data. */
export const LAYER_UNAVAILABLE_REASON: Partial<Record<ThematicLayer, Bilingual>> = {
  population: {
    en: "No official district-level population is published for these localities. Region and emirate totals are shown instead.",
    ar: "لا يوجد عدد سكان رسمي منشور على مستوى هذه المناطق. تُعرض إجماليات المناطق الإحصائية والإمارة بدلاً من ذلك.",
  },
  healthcare: {
    en: "Requires a facility or POI source, which is not connected yet.",
    ar: "يتطلب مصدراً للمرافق أو نقاط الاهتمام، وهو غير متصل بعد.",
  },
};

/**
 * What the nationality and language layers actually encode: the FIRST tag in the
 * published list. `reference/06` lists them in priority order, so the leading tag
 * is the source's own statement of prominence — not a count and not a majority.
 */
export const PRIMARY_TAG_NOTE: Bilingual = {
  en: "Coloured by the first segment listed in the source, which is its stated priority order — not a count or a majority.",
  ar: "مُلوَّنة حسب أول قطاع مذكور في المصدر، وهو ترتيب الأولوية المعلن — وليس عدداً أو أغلبية.",
};

// ---------------------------------------------------------------------------
// Purchasing power — 1..5 (reference/08)
// ---------------------------------------------------------------------------

export type PurchasingPower = 1 | 2 | 3 | 4 | 5;

export const PP_SCORES: readonly PurchasingPower[] = [1, 2, 3, 4, 5];

export const PP_LABELS: Record<PurchasingPower, Bilingual> = {
  1: { en: "Very low", ar: "منخفضة جداً" },
  2: { en: "Low", ar: "منخفضة" },
  3: { en: "Moderate", ar: "متوسطة" },
  4: { en: "High", ar: "مرتفعة" },
  5: { en: "Very high", ar: "مرتفعة جداً" },
};

/** The area-level interpretation of each band, from reference/08. */
export const PP_INTERPRETATION: Record<PurchasingPower, Bilingual> = {
  1: {
    en: "Labour accommodation / industrial workforce; price-sensitive essential services.",
    ar: "مساكن عمالية وقوى عاملة صناعية؛ خدمات أساسية حساسة للسعر.",
  },
  2: {
    en: "Lower-cost housing and budget-led resident or workforce market.",
    ar: "إسكان منخفض التكلفة وسوق مقيمين أو قوى عاملة موجّه بالميزانية.",
  },
  3: {
    en: "Broad mass or mid-market apartments and mixed communities.",
    ar: "شقق للسوق العام أو المتوسط ومجتمعات مختلطة.",
  },
  4: {
    en: "Professional families, established villas, strong discretionary demand.",
    ar: "عائلات مهنية وفلل مستقرة وطلب استهلاكي قوي.",
  },
  5: {
    en: "Luxury villas and towers, executives, diplomats, HNWI and premium destinations.",
    ar: "فلل وأبراج فاخرة وتنفيذيون ودبلوماسيون وأصحاب ثروات ومقاصد متميزة.",
  },
};

/** Helper for reading a bilingual label in the active interface language. */
export function label(value: Bilingual, lang: Lang): string {
  return value[lang];
}
