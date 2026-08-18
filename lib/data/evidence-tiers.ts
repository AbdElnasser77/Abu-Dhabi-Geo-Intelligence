import type { Bilingual } from "@/lib/taxonomy";

/**
 * The three source tiers shown by `components/evidence-tiers.tsx`.
 *
 * Copy is verbatim as specified. These are classes of SOURCE, not the badge
 * vocabulary: `lib/taxonomy.ts` carries six statuses and different words —
 * "Supported" here corresponds to `indicative` there, "Modelled" is spelled
 * `Modeled` on badges, and `calculated`, `qualitative` and `unavailable` have no
 * tier of their own. Kept separate on purpose rather than quietly merged.
 *
 * Colours are the original brand green, gold and red from the design this came
 * from. Gold and red are live theme tokens; the green is stated as a literal
 * because the current dark theme dropped its emerald token, and the token that
 * remains (`official` in lib/colors.ts, #064E3B) is too dark to read as a 3px
 * rule on a black ground.
 */
export type EvidenceTier = {
  readonly id: string;
  readonly label: Bilingual;
  readonly detail: Bilingual;
  readonly color: string;
};

export const EVIDENCE_TIERS: readonly EvidenceTier[] = [
  {
    id: "official",
    label: { en: "Official", ar: "رسمي" },
    detail: {
      en: "SCAD or authorized government publications.",
      ar: "منشورات مركز الإحصاء – أبوظبي أو جهات حكومية معتمدة.",
    },
    color: "#0B7A53",
  },
  {
    id: "supported",
    label: { en: "Supported", ar: "مدعوم" },
    detail: {
      en: "Embassy and multi-source community estimates.",
      ar: "تقديرات من السفارات ومن مصادر مجتمعية متعددة.",
    },
    color: "var(--color-gold)",
  },
  {
    id: "modelled",
    label: { en: "Modelled", ar: "مُنمذج" },
    detail: {
      en: "Transparent assumptions with confidence scores.",
      ar: "افتراضات معلنة مصحوبة بدرجات ثقة.",
    },
    color: "var(--color-uae-red)",
  },
];
