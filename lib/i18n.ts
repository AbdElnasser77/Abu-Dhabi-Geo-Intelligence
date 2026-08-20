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
  // Singular. Without it the count reads "1 matching areas". Arabic keeps the
  // same word: after a number, Arabic does not take the English plural -s, and
  // the existing form already reads correctly for one — flagged for the Arabic
  // reviewer along with the rest of this file.
  matchingArea: { en: "matching area", ar: "منطقة مطابقة" },
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
  // The eyebrow above the headline. Written in caps because that is how it is
  // set; the banner also applies `uppercase`, which is a no-op on the Arabic.
  //
  // NOTE FOR REVIEW: "LIVE" is a marketing claim this dataset does not support.
  // Nothing here is live — `reference/14` is a static 2024 seed and REFERENCE_YEAR
  // is the only year in the product. Copy signed off as-is; if the provenance
  // review pushes back, "MARKET INTELLIGENCE · 2024 BASELINE" says the same thing
  // without the claim.
  heroBadge: {
    en: "LIVE MARKET INTELLIGENCE · 2024 BASELINE",
    ar: "ذكاء سوقي حي · خط أساس 2024",
  },
  // Split across two lines by the banner layout.
  heroTitle: { en: "See Abu Dhabi", ar: "شاهد أبوظبي" },
  // Kept short on purpose: the banner renders the headline in Manrope at
  // lg:text-7xl inside a 48rem column, and a longer second line wraps to a
  // third — which breaks the two-line composition the design is built on.
  heroTitleLine2: { en: "beyond the map.", ar: "أبعد من الخريطة." },
  // The one word of the headline carrying the accent colour. Matched against the
  // headline's own words with trailing punctuation stripped, so it is written
  // here bare — "commit", not "commit." — and must appear verbatim in
  // `heroTitle` or `heroTitleLine2` above or nothing is highlighted.
  heroTitleHighlight: { en: "map", ar: "الخريطة" },
  // NOTE FOR REVIEW: this names five layers, and two of them — population and
  // healthcare — are exactly the two that `LAYER_AVAILABLE` in lib/taxonomy.ts
  // sets to `false`, with their reasons in LAYER_UNAVAILABLE_REASON. The hero
  // therefore promises more than the workspace can render. Copy signed off
  // as-is; the honest version of this sentence is "population, place, purchasing
  // power and languages", or the two layers need their sources connected.
  heroBody: {
    en: "One interactive intelligence layer connecting population, place, purchasing power, languages and healthcare opportunity.",
    ar: "طبقة ذكاء تفاعلية واحدة تربط السكان والمكان والقوة الشرائية واللغات وفرص الرعاية الصحية.",
  },
  // Renamed from heroOpenWorkspace/heroBrowseDirectory: the keys named what the
  // destination was, and the labels no longer do.
  heroPrimaryCta: { en: "Explore the emirate", ar: "استكشف الإمارة" },
  // Points at the baseline-and-sources section, which is the only thing in this
  // product that answers to "executive brief" — scope, counts, data year and the
  // source list. There is no separate brief document or route.
  heroSecondaryCta: { en: "View executive brief", ar: "اطّلع على الملخص التنفيذي" },
  regionsCovered: { en: "Regions covered", ar: "المناطق المشمولة" },
  seedLocalities: { en: "Seed localities", ar: "المناطق الأساسية" },

  // Baseline + sources section (the content moved out of the hero)
  baselineAndSources: { en: "Baseline and sources", ar: "خط الأساس والمصادر" },
  baselineNote: {
    en: "Scope of the current dataset. The counts here describe this dataset and are derived from it; they are not published statistics.",
    ar: "نطاق مجموعة البيانات الحالية. الأعداد هنا تصف هذه المجموعة وتُشتق منها، وهي ليست إحصاءات منشورة.",
  },
  districtDataGap: {
    en: "No official district-level population or nationality count is published for Abu Dhabi. Locality profiles are qualitative planning inputs, and any measure the sources do not carry is shown as a reason rather than a zero.",
    ar: "لا يوجد عدد رسمي منشور للسكان أو الجنسيات على مستوى المناطق في أبوظبي. ملفات المناطق مُدخلات تخطيطية نوعية، وأي مقياس لا تتضمنه المصادر يُعرض كسبب لا كصفر.",
  },

  // ---- Section nav in the top bar ----------------------------------------
  // Labels echo the sections' own headings, so a reader who lands somewhere knows
  // they arrived where the button said. "Signals" is what section 02 calls itself
  // ("02 / Market signals"); "Districts" is used rather than "Directory" because
  // the results table inside the workspace is already the "Live filtered
  // directory" and two things called directory is a collision, not a synonym.
  navSections: { en: "Sections", ar: "الأقسام" },
  navExplore: { en: "Explore", ar: "استكشاف" },
  navSignals: { en: "Signals", ar: "المؤشرات" },
  navDistricts: { en: "Districts", ar: "المناطق" },

  // ---- Market signals section --------------------------------------------
  signalsEyebrow: { en: "Market signals", ar: "مؤشرات السوق" },
  signalsTitle: { en: "Intelligence you can act on.", ar: "معلومات قابلة للتنفيذ." },
  signalsLead: {
    en: "Each signal turns demographic context into a practical healthcare and communication priority — and says plainly where the data stops.",
    ar: "كل مؤشر يترجم السياق السكاني إلى أولوية عملية للرعاية الصحية والتواصل — ويوضح بصراحة حيث تتوقف البيانات.",
  },

  sigCorridorEyebrow: { en: "Premium corridor", ar: "الممر المتميز" },
  sigCorridorTitle: {
    en: "Island and waterfront opportunity",
    ar: "فرص الجزر والواجهات المائية",
  },
  sigCorridorBody: {
    en: "These localities concentrate premium residences, internationally recruited professionals and high-value service potential.",
    ar: "تتركز في هذه المناطق المساكن المتميزة والمهنيون المستقدمون دولياً وإمكانات الخدمات ذات القيمة العالية.",
  },

  sigLanguageEyebrow: { en: "Language coverage", ar: "التغطية اللغوية" },
  sigLanguageTitle: {
    en: "Arabic and English reach every locality",
    ar: "العربية والإنجليزية تصل إلى كل منطقة",
  },
  // The load-bearing caveat. Without it these bars read as population share,
  // which is the figure nobody publishes.
  sigLanguageNote: {
    en: "Localities that list each language as a priority. This is not a share of the population — no such figure is published.",
    ar: "المناطق التي تُدرج كل لغة كأولوية. وهذه ليست نسبة من السكان — فلا يوجد رقم منشور بذلك.",
  },

  sigAgeEyebrow: { en: "Prime age group", ar: "الفئة العمرية الأساسية" },
  sigAgeTitle: { en: "A young, working-age market", ar: "سوق شاب في سن العمل" },
  sigAgeBody: {
    en: "Prevention, family formation and long-term wellness carry this profile far better than late-stage care.",
    ar: "تلائم الوقاية وتكوين الأسرة والعافية طويلة المدى هذا الملف أكثر بكثير من الرعاية في المراحل المتأخرة.",
  },

  sigSegmentEyebrow: { en: "Community mix", ar: "تركيبة المجتمع" },
  sigSegmentTitle: { en: "Who the localities name", ar: "من تذكره المناطق" },

  sigGapTitle: { en: "What this section does not claim", ar: "ما لا تزعمه هذه القائمة" },
  sigGapBody: {
    en: "Service-line demand cannot be ranked from this dataset. Doing so would need a facility or point-of-interest source, which is not connected yet — so no ranking is shown rather than an invented one.",
    ar: "لا يمكن ترتيب الطلب على خطوط الخدمة من مجموعة البيانات هذه. إذ يتطلب ذلك مصدراً للمرافق أو نقاط الاهتمام وهو غير متصل بعد — لذا لا يُعرض أي ترتيب بدلاً من ترتيب مُختلق.",
  },

  ofLocalities: { en: "of 25 localities", ar: "من 25 منطقة" },
  localitiesListing: { en: "localities", ar: "منطقة" },
  scoreOutOfFive: { en: "of 5", ar: "من 5" },
  uniformScore: {
    en: "All five score the maximum.",
    ar: "الخمس جميعها تسجّل الحد الأقصى.",
  },

  // ---- District directory (section 03) -----------------------------------
  dirEyebrow: { en: "District directory", ar: "دليل المناطق" },
  drillInto: { en: "Drill into", ar: "تعمّق في" },
  dirSearchPlaceholder: { en: "Search city or district", ar: "ابحث عن مدينة أو منطقة" },
  dirOpenOnMap: { en: "Open on the map", ar: "افتح على الخريطة" },
  dirNoMatch: {
    en: "No district in this region matches that search.",
    ar: "لا توجد منطقة في هذا الإقليم تطابق هذا البحث.",
  },
  dirCount: { en: "districts", ar: "منطقة" },

  // ---- Evidence tiers -----------------------------------------------------
  evidenceTitle: {
    en: "Every insight carries its evidence.",
    ar: "كل استنتاج يحمل دليله.",
  },
  // Verbatim, one sentence. A second sentence was added here earlier and has been
  // removed: the copy for this section was given exactly.
  evidenceBody: {
    en: "Official statistics, supported estimates and qualitative profiles are never blended without disclosure.",
    ar: "لا تُخلط الإحصاءات الرسمية والتقديرات المدعومة والملفات النوعية دون إفصاح.",
  },
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
