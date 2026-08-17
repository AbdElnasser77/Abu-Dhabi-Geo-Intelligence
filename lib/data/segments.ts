/**
 * Nationality / language marketing matrix, from
 * `reference/07_Nationality_Language_Marketing_Matrix.csv` (15 rows).
 *
 * This is UAE- and emirate-level planning guidance, NOT a district allocation.
 * `reference/05` is explicit: "UAE-wide nationality totals must not be
 * proportionally forced into Abu Dhabi districts without a defensible model and
 * uncertainty bounds." Each row therefore carries its own `caution`, which the
 * UI must render alongside the guidance rather than hide behind a tooltip.
 *
 * `segmentIds` links a row to the canonical filter tags. Several rows
 * deliberately link to nothing (Egyptian, Levantine, Sri Lankan, Chinese,
 * French-speaking, and the Sri Lankan/Chinese niches): the seed locality data
 * does not tag areas at that resolution, and inventing the link would imply
 * geographic precision that does not exist.
 *
 * Language names here are free text, not `LanguageId` tags — the matrix names
 * languages (Sinhala, Tamil, Mandarin, German…) that no area is tagged with.
 *
 * Arabic renderings are translations added for this build, pending
 * Arabic-reviewer sign-off.
 */

import type { Bilingual, SegmentId } from "@/lib/taxonomy";

export type SegmentProfile = {
  readonly key: string;
  readonly name: Bilingual;
  readonly segmentIds: readonly SegmentId[];
  readonly importance: Bilingual;
  readonly priorityLanguages: Bilingual;
  readonly secondaryLanguages: Bilingual | null;
  readonly ppRange: { readonly min: number; readonly max: number };
  readonly highValueSubsegments: Bilingual;
  readonly guidance: Bilingual;
  readonly caution: Bilingual;
};

export const SEGMENT_PROFILES: readonly SegmentProfile[] = [
  {
    key: "emirati",
    name: { en: "Emirati nationals", ar: "المواطنون الإماراتيون" },
    segmentIds: ["emirati"],
    importance: { en: "Core local community", ar: "المجتمع المحلي الأساسي" },
    priorityLanguages: { en: "Arabic; English", ar: "العربية؛ الإنجليزية" },
    secondaryLanguages: null,
    ppRange: { min: 3, max: 5 },
    highValueSubsegments: {
      en: "Business owners; senior government; professional families; HNWI",
      ar: "أصحاب أعمال؛ كبار المسؤولين الحكوميين؛ عائلات مهنية؛ أصحاب ثروات عالية",
    },
    guidance: {
      en: "Arabic-first premium culturally grounded communication; English support",
      ar: "تواصل متميز بالعربية أولاً وبمرجعية ثقافية، مع دعم بالإنجليزية",
    },
    caution: {
      en: "Do not treat all citizens as one income group",
      ar: "لا تعامل جميع المواطنين كفئة دخل واحدة",
    },
  },
  {
    key: "indian",
    name: { en: "Indian", ar: "الهنود" },
    segmentIds: ["indian"],
    importance: {
      en: "Very large strategic expatriate community",
      ar: "مجتمع مقيم كبير جداً واستراتيجي",
    },
    priorityLanguages: {
      en: "English; Hindi; Malayalam",
      ar: "الإنجليزية؛ الهندية؛ المالايالامية",
    },
    secondaryLanguages: {
      en: "Tamil; Telugu; Kannada; Gujarati; Punjabi",
      ar: "التاميلية؛ التيلوغوية؛ الكانادية؛ الغوجاراتية؛ البنجابية",
    },
    ppRange: { min: 1, max: 5 },
    highValueSubsegments: {
      en: "Executives; entrepreneurs; physicians; engineers; affluent families",
      ar: "تنفيذيون؛ رواد أعمال؛ أطباء؛ مهندسون؛ عائلات ميسورة",
    },
    guidance: {
      en: "Segment by profession and language; Malayalam is important for Kerala-origin audiences",
      ar: "التقسيم حسب المهنة واللغة؛ والمالايالامية مهمة لجمهور أصول كيرالا",
    },
    caution: {
      en: "Exact Abu Dhabi district counts not publicly available",
      ar: "الأعداد الدقيقة على مستوى مناطق أبوظبي غير متاحة للعموم",
    },
  },
  {
    key: "pakistani",
    name: { en: "Pakistani", ar: "الباكستانيون" },
    segmentIds: ["pakistani"],
    importance: { en: "Large expatriate community", ar: "مجتمع مقيم كبير" },
    priorityLanguages: { en: "Urdu; English", ar: "الأردية؛ الإنجليزية" },
    secondaryLanguages: {
      en: "Punjabi; Pashto; Arabic",
      ar: "البنجابية؛ البشتوية؛ العربية",
    },
    ppRange: { min: 1, max: 4 },
    highValueSubsegments: {
      en: "Business owners; professionals; established families",
      ar: "أصحاب أعمال؛ مهنيون؛ عائلات مستقرة",
    },
    guidance: {
      en: "Urdu-first community media for broad reach; English for professionals",
      ar: "وسائل إعلام مجتمعية بالأردية أولاً لانتشار واسع؛ والإنجليزية للمهنيين",
    },
    caution: {
      en: "Do not infer income from nationality",
      ar: "لا تستنتج الدخل من الجنسية",
    },
  },
  {
    key: "bangladeshi",
    name: { en: "Bangladeshi", ar: "البنغلاديشيون" },
    segmentIds: ["bangladeshi"],
    importance: {
      en: "Large workforce-oriented segment",
      ar: "قطاع كبير موجّه نحو القوى العاملة",
    },
    priorityLanguages: { en: "Bengali", ar: "البنغالية" },
    secondaryLanguages: { en: "English; Arabic", ar: "الإنجليزية؛ العربية" },
    ppRange: { min: 1, max: 3 },
    highValueSubsegments: {
      en: "Supervisors; entrepreneurs; established residents",
      ar: "مشرفون؛ رواد أعمال؛ مقيمون مستقرون",
    },
    guidance: {
      en: "Practical mobile-first Bengali communication for mass services",
      ar: "تواصل عملي بالبنغالية يبدأ من الهاتف المحمول للخدمات الجماهيرية",
    },
    caution: {
      en: "Resident and daytime workforce must be separated",
      ar: "يجب الفصل بين المقيمين والقوى العاملة النهارية",
    },
  },
  {
    key: "filipino",
    name: { en: "Filipino", ar: "الفلبينيون" },
    segmentIds: ["filipino"],
    importance: {
      en: "Major service and professional community",
      ar: "مجتمع خدمي ومهني رئيسي",
    },
    priorityLanguages: { en: "English; Tagalog", ar: "الإنجليزية؛ التاغالوغية" },
    secondaryLanguages: null,
    ppRange: { min: 2, max: 4 },
    highValueSubsegments: {
      en: "Healthcare; aviation; hospitality; professional families",
      ar: "الرعاية الصحية؛ الطيران؛ الضيافة؛ عائلات مهنية",
    },
    guidance: {
      en: "English performs strongly; Tagalog adds community relevance",
      ar: "الإنجليزية فعّالة بقوة، والتاغالوغية تضيف صلة مجتمعية",
    },
    caution: {
      en: "Local concentration varies significantly",
      ar: "يتفاوت التركّز المحلي بدرجة كبيرة",
    },
  },
  {
    key: "nepali",
    name: { en: "Nepali", ar: "النيباليون" },
    segmentIds: ["nepali"],
    importance: { en: "Important workforce segment", ar: "قطاع مهم من القوى العاملة" },
    priorityLanguages: { en: "Nepali", ar: "النيبالية" },
    secondaryLanguages: { en: "Hindi; English", ar: "الهندية؛ الإنجليزية" },
    ppRange: { min: 1, max: 3 },
    highValueSubsegments: {
      en: "Supervisors; hospitality professionals",
      ar: "مشرفون؛ مهنيو الضيافة",
    },
    guidance: {
      en: "Simple mobile-first Nepali content for workforce campaigns",
      ar: "محتوى نيبالي مبسّط يبدأ من الهاتف المحمول لحملات القوى العاملة",
    },
    caution: {
      en: "Counts by district require authorized data",
      ar: "الأعداد على مستوى المناطق تتطلب بيانات مرخّصة",
    },
  },
  {
    key: "sri_lankan",
    name: { en: "Sri Lankan", ar: "السريلانكيون" },
    segmentIds: [],
    importance: { en: "Established expatriate segment", ar: "قطاع مقيم مستقر" },
    priorityLanguages: {
      en: "Sinhala; Tamil; English",
      ar: "السنهالية؛ التاميلية؛ الإنجليزية",
    },
    secondaryLanguages: null,
    ppRange: { min: 2, max: 4 },
    highValueSubsegments: {
      en: "Professionals; entrepreneurs; families",
      ar: "مهنيون؛ رواد أعمال؛ عائلات",
    },
    guidance: {
      en: "Use English broadly and language-specific community channels selectively",
      ar: "استخدم الإنجليزية على نطاق واسع والقنوات المجتمعية الخاصة بكل لغة بشكل انتقائي",
    },
    caution: {
      en: "Avoid combining Sinhala and Tamil audiences without localization",
      ar: "تجنّب دمج جمهور السنهالية والتاميلية دون توطين",
    },
  },
  {
    key: "arab_expatriates",
    name: { en: "Arab expatriates", ar: "العرب المقيمون" },
    segmentIds: ["arab"],
    importance: {
      en: "Large and diverse regional segment",
      ar: "قطاع إقليمي كبير ومتنوع",
    },
    priorityLanguages: { en: "Arabic; English", ar: "العربية؛ الإنجليزية" },
    secondaryLanguages: {
      en: "French for selected North African / Levant segments",
      ar: "الفرنسية لقطاعات مختارة من شمال أفريقيا وبلاد الشام",
    },
    ppRange: { min: 2, max: 5 },
    highValueSubsegments: {
      en: "Executives; entrepreneurs; professionals; affluent families",
      ar: "تنفيذيون؛ رواد أعمال؛ مهنيون؛ عائلات ميسورة",
    },
    guidance: {
      en: "Arabic must be localized by context; premium bilingual creative is effective",
      ar: "يجب توطين العربية حسب السياق؛ والمحتوى الإبداعي المتميز ثنائي اللغة فعّال",
    },
    caution: {
      en: "Do not present Arab nationalities as a homogeneous market",
      ar: "لا تقدّم الجنسيات العربية كسوق متجانس",
    },
  },
  {
    key: "egyptian",
    name: { en: "Egyptian", ar: "المصريون" },
    segmentIds: [],
    importance: {
      en: "Important Arabic-speaking community",
      ar: "مجتمع مهم ناطق بالعربية",
    },
    priorityLanguages: { en: "Arabic; English", ar: "العربية؛ الإنجليزية" },
    secondaryLanguages: null,
    ppRange: { min: 2, max: 4 },
    highValueSubsegments: {
      en: "Professionals; educators; managers",
      ar: "مهنيون؛ تربويون؛ مديرون",
    },
    guidance: {
      en: "Arabic social/video and community partnerships",
      ar: "محتوى عربي على منصات التواصل والفيديو وشراكات مجتمعية",
    },
    caution: { en: "No exact district allocation", ar: "لا يوجد توزيع دقيق على مستوى المناطق" },
  },
  {
    key: "levantine",
    name: { en: "Levantine", ar: "الشوام" },
    segmentIds: [],
    importance: {
      en: "Important professional and family segment",
      ar: "قطاع مهني وعائلي مهم",
    },
    priorityLanguages: { en: "Arabic; English", ar: "العربية؛ الإنجليزية" },
    secondaryLanguages: {
      en: "French in selected communities",
      ar: "الفرنسية في مجتمعات مختارة",
    },
    ppRange: { min: 3, max: 5 },
    highValueSubsegments: {
      en: "Executives; entrepreneurs; premium families",
      ar: "تنفيذيون؛ رواد أعمال؛ عائلات متميزة",
    },
    guidance: {
      en: "Premium bilingual content and professional channels",
      ar: "محتوى متميز ثنائي اللغة وقنوات مهنية",
    },
    caution: {
      en: "Lebanese, Syrian, Jordanian and Palestinian profiles differ",
      ar: "تختلف الملفات اللبنانية والسورية والأردنية والفلسطينية",
    },
  },
  {
    key: "western",
    name: {
      en: "Western European and North American",
      ar: "أوروبا الغربية وأمريكا الشمالية",
    },
    segmentIds: ["western"],
    importance: {
      en: "Smaller but high-purchasing-power segment",
      ar: "قطاع أصغر لكن بقوة شرائية عالية",
    },
    priorityLanguages: { en: "English", ar: "الإنجليزية" },
    secondaryLanguages: {
      en: "French; German; Italian; Spanish",
      ar: "الفرنسية؛ الألمانية؛ الإيطالية؛ الإسبانية",
    },
    ppRange: { min: 4, max: 5 },
    highValueSubsegments: {
      en: "Executives; diplomats; HNWI; professional families",
      ar: "تنفيذيون؛ دبلوماسيون؛ أصحاب ثروات عالية؛ عائلات مهنية",
    },
    guidance: {
      en: "Premium English-first digital and lifestyle targeting",
      ar: "استهداف رقمي ونمط حياة متميز بالإنجليزية أولاً",
    },
    caution: {
      en: "Small share can still represent high value",
      ar: "الحصة الصغيرة قد تمثّل قيمة عالية",
    },
  },
  {
    key: "russian_speaking",
    name: { en: "Russian-speaking", ar: "الناطقون بالروسية" },
    segmentIds: ["russian_speaking"],
    importance: {
      en: "Smaller high-value and growing segment",
      ar: "قطاع أصغر عالي القيمة ومتنامٍ",
    },
    priorityLanguages: { en: "Russian; English", ar: "الروسية؛ الإنجليزية" },
    secondaryLanguages: null,
    ppRange: { min: 4, max: 5 },
    highValueSubsegments: {
      en: "Investors; HNWI; luxury residents; visitors",
      ar: "مستثمرون؛ أصحاب ثروات عالية؛ سكان فاخرون؛ زوار",
    },
    guidance: {
      en: "Russian luxury/service content concentrated in waterfront and premium areas",
      ar: "محتوى روسي للفخامة والخدمات يتركّز في المناطق المتميزة وعلى الواجهة المائية",
    },
    caution: {
      en: "Validate current local scale before investment",
      ar: "تحقق من الحجم المحلي الحالي قبل الاستثمار",
    },
  },
  {
    key: "chinese",
    name: { en: "Chinese", ar: "الصينيون" },
    segmentIds: [],
    importance: {
      en: "Smaller strategic business/visitor segment",
      ar: "قطاع أصغر استراتيجي للأعمال والزوار",
    },
    priorityLanguages: { en: "Mandarin; English", ar: "الماندرين؛ الإنجليزية" },
    secondaryLanguages: null,
    ppRange: { min: 3, max: 5 },
    highValueSubsegments: {
      en: "Investors; business owners; executives",
      ar: "مستثمرون؛ أصحاب أعمال؛ تنفيذيون",
    },
    guidance: {
      en: "Mandarin landing pages for investment, luxury, health and business themes",
      ar: "صفحات هبوط بالماندرين لموضوعات الاستثمار والفخامة والصحة والأعمال",
    },
    caution: { en: "Use verified audience sizing", ar: "استخدم تقديرات جمهور مُتحقق منها" },
  },
  {
    key: "francophone",
    name: {
      en: "French-speaking African and European",
      ar: "الناطقون بالفرنسية من أفريقيا وأوروبا",
    },
    segmentIds: [],
    importance: {
      en: "Minor-to-moderate niche",
      ar: "قطاع متخصص من طفيف إلى متوسط",
    },
    priorityLanguages: { en: "French; English", ar: "الفرنسية؛ الإنجليزية" },
    secondaryLanguages: { en: "Arabic", ar: "العربية" },
    ppRange: { min: 2, max: 5 },
    highValueSubsegments: {
      en: "Diplomats; executives; professionals; affluent families",
      ar: "دبلوماسيون؛ تنفيذيون؛ مهنيون؛ عائلات ميسورة",
    },
    guidance: {
      en: "Use French selectively for high-value service or community campaigns",
      ar: "استخدم الفرنسية بشكل انتقائي للحملات الخدمية أو المجتمعية عالية القيمة",
    },
    caution: {
      en: "Highly diverse national and income profiles",
      ar: "ملفات وطنية ودخلية متنوعة للغاية",
    },
  },
  {
    key: "african",
    name: {
      en: "African English-speaking communities",
      ar: "المجتمعات الأفريقية الناطقة بالإنجليزية",
    },
    segmentIds: ["african"],
    importance: { en: "Growing diverse segment", ar: "قطاع متنوع متنامٍ" },
    priorityLanguages: { en: "English", ar: "الإنجليزية" },
    secondaryLanguages: {
      en: "French; Arabic; Swahili depending on audience",
      ar: "الفرنسية؛ العربية؛ السواحيلية بحسب الجمهور",
    },
    ppRange: { min: 1, max: 4 },
    highValueSubsegments: {
      en: "Entrepreneurs; professionals; students; workforce",
      ar: "رواد أعمال؛ مهنيون؛ طلاب؛ قوى عاملة",
    },
    guidance: {
      en: "Start with English then localize only with validated segment evidence",
      ar: "ابدأ بالإنجليزية ثم وطّن فقط بوجود أدلة مُتحقق منها للقطاع",
    },
    caution: {
      en: "Do not treat Africa as one nationality or language",
      ar: "لا تتعامل مع أفريقيا كجنسية أو لغة واحدة",
    },
  },
];

/** Matrix rows relevant to an area's tagged segments, in matrix order. */
export function profilesForSegments(
  segments: readonly SegmentId[],
): readonly SegmentProfile[] {
  const wanted = new Set(segments);
  return SEGMENT_PROFILES.filter((p) => p.segmentIds.some((id) => wanted.has(id)));
}
