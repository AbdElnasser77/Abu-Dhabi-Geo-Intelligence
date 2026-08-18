import ResponsiveHeroBanner from "@/components/ui/responsive-hero-banner";
import { HERO_RIM } from "@/lib/hero-rim";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/taxonomy";

/**
 * Landing hero — deliberately minimal.
 *
 * Headline, one sentence, two links, and a badge saying which baseline the page
 * stands on. Everything else the banner can carry is left off:
 *
 *  - **No nav row.** The app already has one sticky bar of navigation
 *    (`components/top-bar.tsx`). A second set of links in the hero would either
 *    duplicate it or invent routes that were deferred.
 *  - **No partner logos.** There are no partner logos in this project to show,
 *    and the source attribution that belongs there instead now has its own
 *    section — `components/baseline-strip.tsx`, which is also what the
 *    "executive brief" action scrolls to.
 *  - **No figures.** They moved to that same section, so the hero is not
 *    carrying governed numbers that each need a status badge beside them.
 *
 * Both CTAs point at anchors the workspace really renders. This is a Server
 * Component: nothing here needs the client, and the banner draws its own
 * client boundary.
 */
export function Hero({ lang }: { lang: Lang }) {
  return (
    <ResponsiveHeroBanner
      // Literal 100vh (`min-h-screen`), by explicit decision.
      //
      // The trade-off, recorded because it is invisible on a desktop and not on a
      // phone: `vh` measures the viewport WITHOUT mobile browser chrome
      // subtracted, so on iOS Safari and Android Chrome the bottom ~90px of this
      // hero starts life behind the address bar. `100svh` — the smallest,
      // always-visible viewport — avoids that, which is why it was used first.
      // `min-h-`, not `h-`, so the frame still grows rather than clipping its copy
      // on a short screen.
      // Pinned from `md` up so the section below rises over it rather than the hero
      // scrolling away. It is NOT dimmed or faded here: the whole transition is
      // owned by the next section's top edge, which blurs and ramps over it. Below
      // `md` it just scrolls: a hero taller than the viewport cannot stick to the
      // top usefully. `z-0` keeps it under the section, which is `z-10`.
      className="min-h-screen md:sticky md:top-0 md:z-0 print-hide"
      // Self-hosted rather than hot-linked from the component author's storage
      // bucket, so the hero cannot break when that bucket moves.
      backgroundImageUrl="/hero/cosmos-limb.jpg"
      // No `badgeLabel`. It used to carry an "Official" status pill, which was
      // true of the old eyebrow ("SCAD emirate and region totals") and is not
      // true of this one — stamping `official` next to a market-intelligence
      // claim is the misattribution reference/00 forbids. The governed status
      // badges live in `components/baseline-strip.tsx` immediately below.
      badgeText={t("heroBadge", lang)}
      title={t("heroTitle", lang)}
      titleLine2={t("heroTitleLine2", lang)}
      // The headline's last word takes the accent. It is named rather than
      // wrapped in markup inside the string so the Arabic translation can point
      // at a different word without the two copies having to agree on tags.
      titleHighlight={t("heroTitleHighlight", lang)}
      description={t("heroBody", lang)}
      primaryButtonText={t("heroPrimaryCta", lang)}
      primaryButtonHref="#map-pane"
      secondaryButtonText={t("heroSecondaryCta", lang)}
      secondaryButtonHref="#baseline"
      // Upstream's play triangle would be a lie on a link that scrolls to a table.
      secondaryButtonIcon="arrow"
      // The opening sequence. The curve is traced from the image above, not
      // drawn by hand, so the drawn line and the photograph's own rim coincide
      // when one hands over to the other — see lib/hero-rim.ts.
      intro={{
        pathD: HERO_RIM.pathD,
        viewBox: HERO_RIM.viewBox,
        stops: HERO_RIM.stops,
        from: HERO_RIM.start,
        to: HERO_RIM.end,
      }}
    />
  );
}
