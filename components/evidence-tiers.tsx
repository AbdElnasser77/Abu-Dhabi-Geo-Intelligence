import { bi, t } from "@/lib/i18n";
import { EVIDENCE_TIERS } from "@/lib/data/evidence-tiers";
import type { Lang } from "@/lib/taxonomy";

/**
 * "Every insight carries its evidence" — three source tiers, and nothing else.
 *
 * The copy here is given verbatim: heading, one sentence, three numbered cards.
 * No eyebrow, no trailing note, no fourth card.
 *
 * These three are a statement about SOURCE CLASSES, not the badge legend. This
 * project's status vocabulary in `lib/taxonomy.ts` has six values and different
 * words — "Supported" here is `indicative` there, "Modelled" is spelled `Modeled`
 * on the badges, and `Calculated`, `Qualitative` and `Unavailable` appear on the
 * page without a tier of their own. They are deliberately left as two separate
 * registers: this section makes a promise about provenance, the badges label
 * individual figures. Worth reconciling one day; not silently, though.
 *
 * Colours are the original brand green, gold and red, matching the design this
 * came from.
 */
export function EvidenceTiers({ lang }: { lang: Lang }) {
  return (
    <section
      id="evidence"
      aria-labelledby="evidence-heading"
      className="scroll-mt-[6.25rem] border-t border-hairline bg-base lg:scroll-mt-topbar"
    >
      <div className="mx-auto grid w-full max-w-[1600px] gap-10 px-5 pt-16 pb-20 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:px-14">
        <div className="reveal-on-scroll">
          <h2
            id="evidence-heading"
            className="text-[2rem] leading-[1.05] tracking-[-0.03em] text-ink sm:text-4xl lg:text-5xl"
          >
            {t("evidenceTitle", lang)}
          </h2>
          <p className="mt-5 max-w-prose text-[13.5px] leading-relaxed text-ink-muted">
            {t("evidenceBody", lang)}
          </p>
        </div>

        <ul className="reveal-stagger grid gap-3 sm:grid-cols-3">
          {EVIDENCE_TIERS.map((tier, index) => (
            <li
              key={tier.id}
              className="flex flex-col overflow-hidden rounded-xl border border-hairline bg-surface"
            >
              <span
                aria-hidden="true"
                className="h-[3px] w-full"
                style={{ backgroundColor: tier.color }}
              />
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] text-ink-faint tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-lg leading-tight text-ink">
                  {bi(tier.label, lang)}
                </h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-ink-muted">
                  {bi(tier.detail, lang)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
