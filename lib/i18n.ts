/**
 * Interface strings, EN + AR.
 *
 * Arabic copy here is a translation produced for this build. `reference/11`
 * lists Arabic-reviewer approval as a release gate, so treat it as pending
 * review rather than final.
 *
 * Numbers: `reference/09` requires that in RTL "numerals and coordinates remain
 * readable", so Arabic uses the `ar-AE-u-nu-latn` locale — Arabic formatting
 * conventions with Latin digits — rather than Eastern Arabic numerals.
 */

import type { Bilingual, Lang } from "@/lib/taxonomy";

const S = {
  brand: { en: "Abu Dhabi Geo-Intelligence", ar: "أبوظبي للذكاء الجغرافي" },
  tagline: {
    en: "Geographic demographic and market intelligence for the Emirate of Abu Dhabi",
    ar: "ذكاء جغرافي سكاني وسوقي لإمارة أبوظبي",
  },
  dataYear: { en: "Data year", ar: "سنة البيانات" },
  onlyYearAvailable: {
    en: "2024 is the only reference year in the current dataset.",
    ar: "عام 2024 هو سنة الإسناد الوحيدة في مجموعة البيانات الحالية.",
  },

  // Search + actions
  search: { en: "Search areas", ar: "البحث في المناطق" },
  searchPlaceholder: {
    en: "Area, alias, language or segment — Arabic or English",
    ar: "منطقة أو اسم بديل أو لغة أو قطاع — بالعربية أو الإنجليزية",
  },
  clearSearch: { en: "Clear search", ar: "مسح البحث" },
  switchToArabic: { en: "العربية", ar: "العربية" },
  switchToEnglish: { en: "English", ar: "English" },
  languageSwitch: { en: "Switch interface language", ar: "تغيير لغة الواجهة" },
  exportCsv: { en: "Export CSV", ar: "تصدير CSV" },
  exportScope: {
    en: "Exports the current filtered results only.",
    ar: "يُصدّر النتائج المُرشّحة الحالية فقط.",
  },

  // Filters
  filters: { en: "Filters", ar: "عوامل التصفية" },
  showFilters: { en: "Show filters", ar: "إظهار عوامل التصفية" },
  hideFilters: { en: "Hide filters", ar: "إخفاء عوامل التصفية" },
  reset: { en: "Reset", ar: "إعادة تعيين" },
  resetAll: { en: "Reset all filters", ar: "إعادة تعيين جميع عوامل التصفية" },
  activeFilters: { en: "Active filters", ar: "عوامل التصفية النشطة" },
  removeFilter: { en: "Remove filter", ar: "إزالة عامل التصفية" },
  filterLogic: {
    en: "Within a group, any selection matches. Across groups, all must match.",
    ar: "داخل المجموعة يكفي تحقق أي خيار. وبين المجموعات يجب تحقق الجميع.",
  },
  region: { en: "Region", ar: "المنطقة" },
  areaCategory: { en: "Area category", ar: "فئة المنطقة" },
  language: { en: "Language", ar: "اللغة" },
  community: { en: "Community segment", ar: "قطاع المجتمع" },
  purchasingPower: { en: "Purchasing power", ar: "القوة الشرائية" },
  density: { en: "Density", ar: "الكثافة" },
  densityDerived: {
    en: "Derived classification — the source text is shown on each profile.",
    ar: "تصنيف مُشتق — يُعرض النص الأصلي في كل ملف.",
  },

  // Results
  matches: { en: "matches", ar: "نتيجة مطابقة" },
  oneMatch: { en: "match", ar: "نتيجة مطابقة" },
  ofTotal: { en: "of 25 seed localities", ar: "من 25 منطقة أساسية" },
  noMatchesTitle: { en: "No areas match this query", ar: "لا توجد مناطق مطابقة لهذا الاستعلام" },
  noMatchesBody: {
    en: "Remove a filter or reset to all regions. The map is holding its current view.",
    ar: "أزل أحد عوامل التصفية أو أعد التعيين لجميع المناطق. تحتفظ الخريطة بعرضها الحالي.",
  },
  directory: { en: "Results directory", ar: "دليل النتائج" },
  directoryNote: {
    en: "This table is the accessible equivalent of the map and always lists exactly the same areas.",
    ar: "هذا الجدول هو المكافئ المتاح للخريطة ويعرض دائماً المناطق نفسها.",
  },

  // Table columns
  colArea: { en: "Area", ar: "المنطقة" },
  colRegion: { en: "Region", ar: "المنطقة الإحصائية" },
  colCategory: { en: "Category", ar: "الفئة" },
  colType: { en: "Area type", ar: "نوع المنطقة" },
  colDensity: { en: "Density profile", ar: "ملف الكثافة" },
  colLanguages: { en: "Priority languages", ar: "اللغات ذات الأولوية" },
  colSegments: { en: "Community segments", ar: "قطاعات المجتمع" },
  colPp: { en: "Purchasing power", ar: "القوة الشرائية" },
  colStatus: { en: "Data status", ar: "حالة البيانات" },

  // Map
  mapLoading: { en: "Loading map…", ar: "جارٍ تحميل الخريطة…" },
  mapLabel: { en: "Interactive map of Abu Dhabi Emirate", ar: "خريطة تفاعلية لإمارة أبوظبي" },
  thematicLayer: { en: "Thematic layer", ar: "الطبقة الموضوعية" },
  legend: { en: "Legend", ar: "مفتاح الخريطة" },
  resetView: { en: "Reset view", ar: "إعادة ضبط العرض" },
  unavailableLayersTitle: { en: "Not yet available", ar: "غير متوفرة بعد" },
  unavailableLayersNote: {
    en: "These layers require district-level data that is not published in the current dataset.",
    ar: "تتطلب هذه الطبقات بيانات على مستوى المناطق غير منشورة في مجموعة البيانات الحالية.",
  },
  pointProfileNote: {
    en: "Point locations, not boundaries. Official or licensed polygons are not yet available, so each locality is shown at its centre coordinate.",
    ar: "مواقع نقطية وليست حدوداً. لا تتوفر بعد مضلعات رسمية أو مرخّصة، لذا تُعرض كل منطقة عند إحداثي مركزها.",
  },

  emirateDemographics: {
    en: "Emirate demographics",
    ar: "الخصائص السكانية للإمارة",
  },
  roundedHeadline: {
    en: "Rounded official headline figure",
    ar: "رقم رئيسي رسمي مُدوَّر",
  },
  unitYears: { en: "years", ar: "سنة" },
  unitUnits: { en: "units", ar: "وحدة" },

  // Region outlines + region intelligence panel
  intelligenceLayer: { en: "Intelligence layer", ar: "طبقة المعلومات" },
  matchingAreas: { en: "matching areas", ar: "منطقة مطابقة" },
  baseline: { en: "2024 baseline", ar: "خط أساس 2024" },
  officialBaseline: { en: "Official baseline", ar: "خط أساس رسمي" },
  liveFilteredDirectory: { en: "Live filtered directory", ar: "الدليل المُرشّح المباشر" },
  boundaryNote: {
    en: "Dashed outlines: approximate operational envelopes, not administrative boundaries",
    ar: "الخطوط المتقطعة: أغلفة تشغيلية تقريبية وليست حدوداً إدارية",
  },
  boundaryExplain: {
    en: "The reference package contains no boundary geometry. Each outline is the bounding box of that region's seed localities, padded for legibility. It is never used in any filter, calculation or export. Licensed GeoJSON boundaries would replace it directly.",
    ar: "لا تحتوي حزمة المراجع على أي هندسة للحدود. كل مخطط هو الإطار المحيط بالمناطق الأساسية لتلك المنطقة، مع هامش للوضوح. ولا يُستخدم في أي تصفية أو حساب أو تصدير. وستحل حدود GeoJSON المرخّصة مكانه مباشرة.",
  },
  regionIntelligence: { en: "Region intelligence", ar: "معلومات المنطقة" },
  annualGrowth: { en: "Annual growth", ar: "النمو السنوي" },
  emirateWide: { en: "emirate-wide", ar: "على مستوى الإمارة" },
  growthRegionUnavailable: {
    en: "Per-region growth is not published; the emirate rate is shown.",
    ar: "لا يُنشر النمو لكل منطقة؛ يُعرض معدل الإمارة.",
  },
  builtEnvironment: { en: "Built environment", ar: "البيئة المبنية" },
  languagePriority: { en: "Language priority", ar: "أولوية اللغات" },
  communityPriority: { en: "Community segments", ar: "قطاعات المجتمع" },
  derivedFromLocalities: {
    en: "Derived from this region's localities",
    ar: "مستمد من مناطق هذه المنطقة الإحصائية",
  },
  filterToRegion: { en: "Filter to this region", ar: "التصفية على هذه المنطقة" },
  clearRegionFilter: { en: "Clear region filter", ar: "إلغاء تصفية المنطقة" },
  localitiesInRegion: { en: "seed localities", ar: "منطقة أساسية" },
  hoverRegionHint: {
    en: "Click a dashed region outline on the map to open its roll-up.",
    ar: "اضغط على مخطط منطقة متقطع على الخريطة لعرض ملخصها.",
  },
  dismissRegion: { en: "Close region panel", ar: "إغلاق لوحة المنطقة" },
  layerUnavailable: { en: "Not available", ar: "غير متوفرة" },
  activeLayer: { en: "layer", ar: "طبقة" },
  filteredAreas: { en: "filtered areas", ar: "منطقة مُرشّحة" },

  // Clustering (reference/01: "Cluster markers at low zoom and progressively
  // reveal districts at higher zoom"). reference/15 §4 allows the map's feature
  // count to differ from the row count ONLY for declared clustering — hence the
  // visible notice rather than a silent regrouping.
  areasGrouped: {
    en: "areas are grouped at this zoom",
    ar: "منطقة مجمّعة عند مستوى التكبير الحالي",
  },
  zoomToSeparate: { en: "Zoom in to separate them", ar: "كبّر الخريطة للفصل بينها" },
  clusterOfAreas: { en: "areas grouped here", ar: "مناطق مجمّعة هنا" },
  clusterActivate: { en: "Activate to zoom in", ar: "اضغط للتكبير" },

  // Hover / focus detail popup (reference/03 "Hover: outline + concise tooltip")
  openProfileHint: {
    en: "Click for the full profile",
    ar: "اضغط لعرض الملف الكامل",
  },

  // Map error / degraded states (reference/10 "Error states")
  mapErrorTitle: { en: "The map could not start", ar: "لم تتمكن الخريطة من العمل" },
  mapErrorFallback: {
    en: "Every area is still listed in the results table below, with the same filters applied.",
    ar: "جميع المناطق لا تزال مدرجة في جدول النتائج أدناه، مع تطبيق عوامل التصفية نفسها.",
  },
  mapRetry: { en: "Retry map", ar: "إعادة محاولة الخريطة" },
  mapErrorDetail: { en: "Technical detail", ar: "تفاصيل فنية" },
  mapWebglMissing: {
    en: "This browser is not exposing WebGL 2, which MapLibre GL requires. It is usually blocked by hardware acceleration being switched off, a remote-desktop session, or an outdated graphics driver.",
    ar: "هذا المتصفح لا يوفّر WebGL 2 الذي تتطلبه مكتبة MapLibre GL. يحدث ذلك عادةً عند تعطيل تسريع العتاد، أو في جلسة سطح مكتب بعيد، أو مع برنامج تعريف رسومات قديم.",
  },
  mapSlowTitle: { en: "The map is taking longer than expected", ar: "تأخر تحميل الخريطة أكثر من المتوقع" },
  mapSlowBody: {
    en: "The map code has not finished loading. A hard refresh usually clears this. If it persists, check the browser console for a blocked request.",
    ar: "لم يكتمل تحميل شيفرة الخريطة. غالباً ما يحل التحديث الكامل للصفحة المشكلة. وإن استمرت، فتحقق من وحدة التحكم في المتصفح بحثاً عن طلب محجوب.",
  },
  mapTilesFailed: {
    en: "Some basemap tiles failed to load. Marker positions are still correct.",
    ar: "تعذّر تحميل بعض بلاطات الخريطة الأساسية. مواضع المؤشرات لا تزال صحيحة.",
  },

  // Selection / profile
  selectAreaPrompt: {
    en: "Select an area on the map or in the table to open its profile.",
    ar: "اختر منطقة على الخريطة أو في الجدول لعرض ملفها.",
  },
  closeProfile: { en: "Close profile", ar: "إغلاق الملف" },
  clearSelection: { en: "Clear selection", ar: "إلغاء التحديد" },
  emirate: { en: "Emirate of Abu Dhabi", ar: "إمارة أبوظبي" },
  viewOnMap: { en: "Show on map", ar: "إظهار على الخريطة" },

  // Tabs (reference/09 "Profile tabs")
  tabOverview: { en: "Overview", ar: "نظرة عامة" },
  tabDemographics: { en: "Demographics", ar: "الخصائص السكانية" },
  tabLanguages: { en: "Languages", ar: "اللغات" },
  tabPp: { en: "Purchasing power", ar: "القوة الشرائية" },
  tabBuilt: { en: "Built environment", ar: "البيئة المبنية" },
  tabOpportunities: { en: "Opportunities", ar: "الفرص" },
  tabSources: { en: "Sources", ar: "المصادر" },

  // Profile content
  coordinates: { en: "Coordinates", ar: "الإحداثيات" },
  parentRegion: { en: "Parent region", ar: "المنطقة الأم" },
  areaTypeLabel: { en: "Area type", ar: "نوع المنطقة" },
  typeCodeLabel: { en: "Taxonomy code", ar: "رمز التصنيف" },
  densityProfileLabel: { en: "Density profile", ar: "ملف الكثافة" },
  synopsis: { en: "Synopsis", ar: "الخلاصة" },
  populationLabel: { en: "Population", ar: "عدد السكان" },
  regionTotalContext: { en: "Region total (official)", ar: "إجمالي المنطقة (رسمي)" },
  emirateTotal: { en: "Emirate total", ar: "إجمالي الإمارة" },
  shareOfEmirate: { en: "Share of emirate", ar: "النسبة من الإمارة" },
  priorityLanguages: { en: "Priority languages", ar: "اللغات ذات الأولوية" },
  secondaryLanguages: { en: "Secondary languages", ar: "اللغات الثانوية" },
  asPublished: { en: "As published", ar: "كما نُشرت" },
  communitySegments: { en: "Community segments", ar: "قطاعات المجتمع" },
  evidenceLevel: { en: "Evidence level", ar: "مستوى الدليل" },
  importance: { en: "Indicative importance", ar: "الأهمية الاستدلالية" },
  highValueSubsegments: { en: "High-value subsegments", ar: "القطاعات الفرعية عالية القيمة" },
  marketingGuidance: { en: "Marketing guidance", ar: "توجيهات تسويقية" },
  dataCaution: { en: "Data caution", ar: "تنبيه بشأن البيانات" },
  ppRangeLabel: { en: "Typical purchasing-power range", ar: "النطاق النمطي للقوة الشرائية" },
  ppScore: { en: "Score", ar: "الدرجة" },
  ppOutOf: { en: "of 5", ar: "من 5" },
  ppInterpretation: { en: "Area interpretation", ar: "تفسير المنطقة" },
  ppComponentsTitle: { en: "Component model", ar: "نموذج المكوّنات" },
  ppComponentsNote: {
    en: "This is the published weighting method. Component scores, raw score and reviewer are not published for this area, so only the band is shown.",
    ar: "هذه هي منهجية الترجيح المنشورة. لا تُنشر درجات المكوّنات ولا الدرجة الخام ولا المُراجِع لهذه المنطقة، لذا تُعرض الفئة فقط.",
  },
  ppEthics: {
    en: "An area-level marketing indicator only — never a statement about any individual's income or credit, and nationality is not an input.",
    ar: "مؤشر تسويقي على مستوى المنطقة فقط — وليس حكماً على دخل أي فرد أو جدارته الائتمانية، والجنسية ليست مُدخلاً فيه.",
  },
  weight: { en: "Weight", ar: "الوزن" },
  component: { en: "Component", ar: "المكوّن" },
  exampleEvidence: { en: "Example evidence", ar: "أمثلة الأدلة" },
  residentVsDaytime: {
    en: "Resident, daytime workforce and visitor purchasing power are different populations and are not separated in this dataset.",
    ar: "القوة الشرائية للمقيمين والقوى العاملة النهارية والزوار تخص فئات مختلفة، وهي غير مفصولة في هذه البيانات.",
  },
  opportunitiesIntro: {
    en: "Derived from the emirate-level nationality and language matrix, matched to this area's tagged segments. Emirate-level guidance, not a district allocation.",
    ar: "مستمدة من مصفوفة الجنسيات واللغات على مستوى الإمارة ومطابَقة لقطاعات هذه المنطقة. توجيهات على مستوى الإمارة وليست توزيعاً على المناطق.",
  },
  noSegmentGuidance: {
    en: "No emirate-level matrix row maps to this area's segment tags at the published resolution.",
    ar: "لا يوجد صف في مصفوفة الإمارة يطابق وسوم قطاعات هذه المنطقة بالدقة المنشورة.",
  },
  sourcesIntro: {
    en: "Official figures shown anywhere in this profile trace to the sources below. The locality profile itself is qualitative and carries no published source figure.",
    ar: "الأرقام الرسمية الواردة في هذا الملف تعود إلى المصادر أدناه. أما ملف المنطقة نفسه فهو نوعي ولا يستند إلى رقم منشور.",
  },
  openSource: { en: "Open source", ar: "فتح المصدر" },
  asPublishedSegments: {
    en: "Segment and language tags exactly as published in the seed dataset",
    ar: "وسوم القطاعات واللغات كما نُشرت في مجموعة البيانات الأساسية",
  },
  normalisedTags: { en: "Normalised tags used for filtering", ar: "الوسوم المعيارية المستخدمة للتصفية" },

  // Governance
  dataStatusLabel: { en: "Data status", ar: "حالة البيانات" },
  whatThisMeans: { en: "What this means", ar: "ماذا يعني ذلك" },
  methodology: { en: "Methodology", ar: "المنهجية" },
  sourceLabel: { en: "Source", ar: "المصدر" },
  governanceBanner: {
    en: "Emirate and region totals are official SCAD statistics. All 25 locality profiles are qualitative planning inputs — no official district-level population or nationality count is published.",
    ar: "إجماليات الإمارة والمناطق إحصاءات رسمية من مركز الإحصاء – أبوظبي. أما ملفات المناطق الـ25 فهي مُدخلات تخطيطية نوعية — ولا يوجد عدد رسمي منشور للسكان أو الجنسيات على مستوى المناطق.",
  },
  notPublished: {
    en: "Not published at district level",
    ar: "غير منشور على مستوى المناطق",
  },
  skipToMap: { en: "Skip to map", ar: "تخطَّ إلى الخريطة" },
  skipToResults: { en: "Skip to results", ar: "تخطَّ إلى النتائج" },

  // Hero
  heroTitle: {
    en: "Read the emirate before you commit to a location.",
    ar: "اقرأ الإمارة قبل أن تلتزم بموقع.",
  },
  heroBody: {
    en: "An interactive map of 25 localities across all three regions — every figure carrying its status, its source and its reference year. Where a number is not published, this map says so instead of estimating one.",
    ar: "خريطة تفاعلية لـ25 منطقة في المناطق الثلاث كلها — كل رقم يحمل حالته ومصدره وسنة إسناده. وحين لا يكون الرقم منشورًا، تقول الخريطة ذلك بدلًا من تقديره.",
  },
  heroOpenWorkspace: { en: "Open the workspace", ar: "افتح مساحة العمل" },
  heroBrowseDirectory: { en: "Browse the directory", ar: "استعرض الدليل" },
  regionsCovered: { en: "Regions covered", ar: "المناطق المشمولة" },
  seedLocalities: { en: "Seed localities", ar: "المناطق الأساسية" },
} as const;

export type StringKey = keyof typeof S;

export function t(key: StringKey, lang: Lang): string {
  return S[key][lang];
}

/** Read any bilingual value in the active language. */
export function bi(value: Bilingual, lang: Lang): string {
  return value[lang];
}

const NUMBER_LOCALE: Record<Lang, string> = {
  en: "en-AE",
  // Latin digits in Arabic, per reference/09.
  ar: "ar-AE-u-nu-latn",
};

export function formatNumber(value: number, lang: Lang): string {
  return new Intl.NumberFormat(NUMBER_LOCALE[lang]).format(value);
}

export function formatPercent(value: number, lang: Lang): string {
  return new Intl.NumberFormat(NUMBER_LOCALE[lang], {
    maximumFractionDigits: 1,
  }).format(value);
}

/** Coordinate display — always Latin digits, 4 decimal places (WGS84). */
export function formatCoord(value: number): string {
  return value.toFixed(4);
}

export function dir(lang: Lang): "ltr" | "rtl" {
  return lang === "ar" ? "rtl" : "ltr";
}

export function htmlLang(lang: Lang): string {
  return lang === "ar" ? "ar-AE" : "en";
}

/**
 * Purchasing-power component weights, from `reference/08`. Presented as
 * methodology only — the seed data publishes no per-area component scores.
 */
export const PP_COMPONENTS: readonly {
  readonly name: Bilingual;
  readonly weight: number;
  readonly evidence: Bilingual;
}[] = [
  {
    name: { en: "Housing / building form", ar: "الإسكان وشكل المبنى" },
    weight: 25,
    evidence: {
      en: "Villa, luxury tower or labour-accommodation share",
      ar: "نسبة الفلل أو الأبراج الفاخرة أو مساكن العمال",
    },
  },
  {
    name: { en: "Property / rent proxy", ar: "مؤشر العقار والإيجار" },
    weight: 20,
    evidence: {
      en: "Median rent or sale price from a licensed source",
      ar: "الوسيط للإيجار أو سعر البيع من مصدر مرخّص",
    },
  },
  {
    name: { en: "Occupation / income proxy", ar: "مؤشر المهنة والدخل" },
    weight: 20,
    evidence: {
      en: "Professional and managerial versus workforce composition",
      ar: "تركيبة المهنيين والإداريين مقابل القوى العاملة",
    },
  },
  {
    name: { en: "Retail / lifestyle access", ar: "الوصول للتجزئة ونمط الحياة" },
    weight: 15,
    evidence: {
      en: "Premium retail, hospitality and private services",
      ar: "التجزئة المتميزة والضيافة والخدمات الخاصة",
    },
  },
  {
    name: { en: "Household stability", ar: "استقرار الأسرة" },
    weight: 10,
    evidence: {
      en: "Family tenure, household size, established community",
      ar: "مدة الإقامة وحجم الأسرة واستقرار المجتمع",
    },
  },
  {
    name: { en: "Daytime / visitor economy", ar: "الاقتصاد النهاري والزوار" },
    weight: 10,
    evidence: {
      en: "Offices, tourism, financial district or industrial inflow",
      ar: "المكاتب والسياحة والحي المالي أو التوافد الصناعي",
    },
  },
];
