"use client";

import React, { useState } from "react";

/**
 * Full-bleed hero banner.
 *
 * The layout is upstream's: a cover photograph, a display headline at
 * `lg:text-7xl`, a translucent pill badge, pill actions, an optional nav pill and
 * an optional partner row over a full-height frame.
 *
 * Six things are adapted:
 *
 *  1. **No remote asset defaults.** Upstream defaulted the logo, background and
 *     five partner logos to URLs on someone else's storage bucket. A page that
 *     silently 404s when that bucket moves is not a default worth shipping, so
 *     assets are opt-in — pass a self-hosted path. With no background the frame
 *     paints a gradient instead of showing a broken image.
 *  2. **The mobile menu button opens a menu.** Upstream toggled
 *     `mobileMenuOpen` and never rendered anything with it.
 *  3. **Optional chrome.** Nav, CTA and partner rows render only when supplied,
 *     so the banner can be used stripped back to a headline.
 *  4. **Direction-aware.** Arrows mirror under RTL and spacing uses logical
 *     properties, because this app ships Arabic.
 *  5. **The copy is vertically centred, not top-anchored.** Upstream pins it
 *     under a stack of `pt-28`/`md:pt-32`/`lg:pt-40`, which leaves the copy in
 *     the top third and the photograph carrying the rest. Centring it is what
 *     makes the opening sequence land: the drawn rim sweeps corner to corner, and
 *     the headline it hands over to belongs in the middle of that sweep rather
 *     than above it. Implemented as a flex column — see the note on the content
 *     wrapper — because `place-items-center` on the section would also try to
 *     centre the header row.
 *  6. **The accent is the app's, not white.** Upstream fills its solid actions
 *     with white — the correct choice in a monochrome dark system. This app's
 *     accent is the flare sampled from this very photograph, so the primary
 *     action and the badge take `bg-flare-gradient` and the whole page reads as
 *     one palette rather than the hero and the tool below it disagreeing.
 *
 * `font-display` is a real utility here: the token that generates it is declared
 * in `app/globals.css` and Manrope is loaded in `app/layout.tsx`. Without both,
 * that class is inert and the headline silently falls back to the body sans.
 */

export interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface Partner {
  logoUrl: string;
  href: string;
  label: string;
}

/**
 * A one-shot opening sequence: black frame, a dot of light igniting at the start
 * of a traced curve, the line drawing behind it, then the photograph fading up
 * underneath and the copy last. Purely CSS once rendered — no JS, no state, so
 * there is nothing to hydrate and no flash of the finished frame first.
 */
export interface HeroIntro {
  /** The curve, in the background image's own coordinate space. */
  pathD: string;
  /** Must match the image's pixel dimensions so the curve lands on the rim. */
  viewBox: string;
  /** Gradient stops along the curve, ideally sampled from the image itself. */
  stops: readonly { readonly offset: string; readonly color: string }[];
  /** Endpoints of the gradient, in the same space as `pathD`. */
  from: readonly [number, number];
  to: readonly [number, number];
}

export interface ResponsiveHeroBannerProps {
  /** Optional wordmark image shown at the inline-start of the header. */
  logoUrl?: string;
  logoLabel?: string;
  /**
   * Cover photograph. Pass a self-hosted path. When omitted the frame paints a
   * brand gradient, the honest fallback for a page with no image asset.
   */
  backgroundImageUrl?: string;
  navLinks?: NavLink[];
  ctaButtonText?: string;
  ctaButtonHref?: string;
  badgeText?: string;
  badgeLabel?: string;
  title: string;
  titleLine2?: string;
  /**
   * One word of the headline to render in the accent colour. Matched against the
   * headline's own words with trailing punctuation stripped, so pass it bare
   * ("commit", not "commit.") and the full stop stays in the body colour.
   * Case-insensitive; a word that does not occur simply highlights nothing.
   */
  titleHighlight?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  /**
   * Upstream's secondary action is "Watch Launch", so its glyph is a play
   * triangle. An action that navigates rather than plays should not claim to
   * play — hence the choice, defaulting to upstream's.
   */
  secondaryButtonIcon?: "play" | "arrow";
  partnersTitle?: string;
  partners?: Partner[];
  /** Opening sequence. Omit for a hero that is simply present on load. */
  intro?: HeroIntro;
  /** Accessible name for the mobile menu toggle. */
  menuLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

/*
 * Trailing punctuation, stripped before matching `titleHighlight`. Includes the
 * Arabic comma and question mark, because the headline is translated and
 * `heroTitleLine2` really does end in a full stop in both languages.
 */
const TRAILING_PUNCTUATION = /[.,;:!?،؛؟…]+$/u;

/**
 * Splits one line of the headline into per-word spans so each can fade in on its
 * own delay.
 *
 * Three details are load-bearing:
 *
 *  - **The index is continuous across both lines.** `start` is threaded in and
 *    the next start returned, so "before" (the fourth word) keeps counting from
 *    "emirate" rather than restarting — otherwise line two would replay line
 *    one's stagger and the two lines would arrive in parallel.
 *  - **The delay is a CSS custom property, not an `animation-delay`.** JS sets
 *    `--w` to the word's ordinal and the stylesheet multiplies it by a step it
 *    owns, which is what lets the intro sequence retime the whole headline by
 *    changing two variables instead of re-rendering.
 *  - **The separating space is a real text node between the spans, not padding
 *    or a trailing space inside one.** `hero-word` is `inline-block`, and an
 *    inline-block's own trailing whitespace collapses — the words would run
 *    together. A text node between them survives, wraps normally, and keeps the
 *    line readable to a screen reader as ordinary text.
 */
function splitWords(
  text: string,
  start: number,
  highlight?: string,
): { nodes: React.ReactNode[]; next: number } {
  const words = text.split(/\s+/).filter(Boolean);
  const target = highlight?.toLocaleLowerCase();
  return {
    next: start + words.length,
    nodes: words.map((word, i) => {
      const bare = word.replace(TRAILING_PUNCTUATION, "");
      const tail = word.slice(bare.length);
      const accented = target !== undefined && bare.toLocaleLowerCase() === target;
      return (
        <React.Fragment key={`${start + i}-${word}`}>
          <span
            className="hero-word"
            style={{ "--w": start + i } as React.CSSProperties}
          >
            {/*
              The accent colours the WORD, not its punctuation. "map." gets an
              orange "map" and a white full stop, because a coloured terminal
              period reads as a bullet or a stray mark at display size rather
              than as the end of the sentence — and the accent is meant to land
              on the meaning, which the punctuation is not part of.

              The colour goes on an inner span so the animated `.hero-word` box
              stays whole: splitting the word itself into two inline-blocks would
              let the browser break the line between "map" and "." and would give
              each half its own transform origin.
            */}
            {accented ? (
              <>
                <span className="text-flare">{bare}</span>
                {tail}
              </>
            ) : (
              word
            )}
          </span>
          {i < words.length - 1 ? " " : null}
        </React.Fragment>
      );
    }),
  };
}

const SVG_BASE = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Mirrors under RTL, so "forward" always points the way the text runs. */
const ARROW_FORWARD = (
  <svg {...SVG_BASE} className="h-4 w-4 rtl:-scale-x-100">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

/** Upstream's nav CTA glyph: an arrow leaving the corner. */
const ARROW_OUT = (
  <svg {...SVG_BASE} className="h-4 w-4 rtl:-scale-x-100">
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
);

const PLAY = (
  <svg {...SVG_BASE} className="h-4 w-4 rtl:-scale-x-100">
    <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
  </svg>
);

const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
  logoUrl,
  logoLabel = "Home",
  backgroundImageUrl,
  navLinks,
  ctaButtonText,
  ctaButtonHref = "#",
  badgeLabel,
  badgeText,
  title,
  titleLine2,
  titleHighlight,
  description,
  primaryButtonText,
  primaryButtonHref = "#",
  secondaryButtonText,
  secondaryButtonHref = "#",
  secondaryButtonIcon = "play",
  partnersTitle,
  partners,
  intro,
  menuLabel = "Toggle menu",
  className = "",
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Word ordinals run continuously from the first line into the second.
  const line1 = splitWords(title, 0, titleHighlight);
  const line2 = titleLine2 ? splitWords(titleLine2, line1.next, titleHighlight) : null;
  const hasNav = Boolean(navLinks?.length) || Boolean(ctaButtonText);
  const hasHeader = hasNav || Boolean(logoUrl);

  return (
    <section
      // `data-intro` is what the stylesheet keys the whole sequence off. Without
      // it every element renders in its finished state.
      data-intro={intro ? "" : undefined}
      className={`relative isolate flex w-full flex-col overflow-hidden bg-black ${className}`}
    >
      {backgroundImageUrl ? (
        /* A decorative full-bleed cover. `next/image` would require every host
           in `images.remotePatterns` and buys nothing here — the element is
           sized by the layout, not by its intrinsic dimensions. */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={backgroundImageUrl}
          alt=""
          aria-hidden="true"
          className="hero-intro-bg absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="hero-intro-bg absolute inset-0 bg-[radial-gradient(120%_100%_at_72%_0%,#0B7A53_0%,#064E3B_36%,#0C1F17_72%,#070C0A_100%)]"
        />
      )}
      {/*
        Upstream lays only a `ring-black/30` inset over the image. This adds a
        near-invisible scrim at the TOP too, because white copy over an arbitrary
        photograph is a contrast gamble — it costs nothing on a dark image and
        rescues a light one.

        Nothing darkens the bottom any more. The handover to whatever follows is
        that section's job, not the hero's: it owns the blur and the ramp on its
        own top edge, so the hero is left as the photograph it is.
      */}
      <div
        aria-hidden="true"
        className="hero-intro-bg absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ring-1 ring-black/30 ring-inset"
      />

      {intro && (
        /*
         * Two copies of one path. The trail is revealed by running
         * `stroke-dashoffset` to zero; the head is a single very short
         * round-capped dash on the SAME path, which is why it can never drift
         * off the curve and why it needs no motion-path or JS. `pathLength=1`
         * normalises both to 0..1 so the dash maths is independent of the
         * rendered size at any viewport.
         */
        <svg
          className="hero-intro-line"
          viewBox={intro.viewBox}
          // Matches the image's `object-cover`: scale uniformly and crop. With
          // `none` the curve would shear away from the rim at every aspect
          // ratio but one.
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            {/*
              An explicit filter region, in user space, covering the whole frame.
              This is not decoration: with a CSS `drop-shadow()` the region is
              derived from the PAINTED geometry, so while the dash grows the
              region grows with it and its boundary is visible as a faint
              rectangle crawling across the frame. A fixed `filterUnits`
              rectangle is constant for every frame, so there is no edge to see.
              Blurring SourceGraphic also means the bloom inherits the stroke
              gradient instead of a single flood colour.
            */}
            <filter
              id="hero-rim-glow"
              filterUnits="userSpaceOnUse"
              x="-120"
              y="-120"
              width="4080"
              height="2392"
              colorInterpolationFilters="sRGB"
            >
              {/*
                ONE blur pass. Intensity is recovered by merging the same result
                twice rather than blurring again — that brightens the halo for
                free, where a second pass would widen it at real cost. The broad
                outer bloom is the photograph's job anyway, and it arrives just as
                this fades out.

                Note on measurement: a headless software rasteriser could not
                reliably separate one pass from two here — both sat at the same
                ~33ms floor as rendering with no filter at all, and a single
                earlier sample suggesting otherwise did not reproduce. So this is
                chosen because it is strictly less work for no visible loss, not
                because a cost was demonstrated. Re-measure on real hardware
                before adding passes back.
              */}
              <feGaussianBlur in="SourceGraphic" stdDeviation="22" result="halo" />
              <feMerge>
                <feMergeNode in="halo" />
                <feMergeNode in="halo" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient
              id="hero-rim-gradient"
              gradientUnits="userSpaceOnUse"
              x1={intro.from[0]}
              y1={intro.from[1]}
              x2={intro.to[0]}
              y2={intro.to[1]}
            >
              {intro.stops.map((stop) => (
                <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
          </defs>
          <path className="hero-intro-trail" d={intro.pathD} pathLength={1} />
          <path className="hero-intro-head" d={intro.pathD} pathLength={1} />
        </svg>
      )}

      {hasHeader && (
        <header className="relative z-10 xl:top-4">
          <div className="mx-6">
            <div className="flex items-center justify-between pt-4">
              {logoUrl ? (
                <a
                  href="#"
                  aria-label={logoLabel}
                  className="inline-flex h-[40px] w-[100px] items-center justify-center rounded bg-cover bg-center"
                  style={{ backgroundImage: `url(${logoUrl})` }}
                />
              ) : (
                <span />
              )}

              {hasNav && (
                <nav className="hidden items-center gap-2 md:flex">
                  <div className="flex items-center gap-1 rounded-full bg-white/5 px-1 py-1 ring-1 ring-white/10 backdrop-blur">
                    {navLinks?.map((link) => (
                      <a
                        key={link.href + link.label}
                        href={link.href}
                        aria-current={link.isActive ? "page" : undefined}
                        className={`px-3 py-2 text-sm font-medium transition-colors hover:text-white ${
                          link.isActive ? "text-white/90" : "text-white/80"
                        }`}
                      >
                        {link.label}
                      </a>
                    ))}
                    {ctaButtonText && (
                      <a
                        href={ctaButtonHref}
                        className="bg-flare-gradient ms-1 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold text-flare-ink transition-opacity hover:opacity-90"
                      >
                        {ctaButtonText}
                        {ARROW_OUT}
                      </a>
                    )}
                  </div>
                </nav>
              )}

              {hasNav && (
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((open) => !open)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur md:hidden"
                  aria-expanded={mobileMenuOpen}
                  aria-controls="hero-mobile-menu"
                  aria-label={menuLabel}
                >
                  <svg {...SVG_BASE} className="h-5 w-5 text-white/90">
                    {mobileMenuOpen ? (
                      <>
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </>
                    ) : (
                      <>
                        <path d="M4 5h16" />
                        <path d="M4 12h16" />
                        <path d="M4 19h16" />
                      </>
                    )}
                  </svg>
                </button>
              )}
            </div>

            {/* The panel the toggle above claims to control. */}
            {hasNav && mobileMenuOpen && (
              <div
                id="hero-mobile-menu"
                className="mt-3 rounded-2xl bg-black/50 p-2 ring-1 ring-white/15 backdrop-blur md:hidden"
              >
                {navLinks?.map((link) => (
                  <a
                    key={link.href + link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={link.isActive ? "page" : undefined}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/85 hover:bg-white/10 hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
                {ctaButtonText && (
                  <a
                    href={ctaButtonHref}
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-flare-gradient mt-1 flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-flare-ink"
                  >
                    {ctaButtonText}
                    {ARROW_OUT}
                  </a>
                )}
              </div>
            )}
          </div>
        </header>
      )}

      {/*
        The centring. `flex-1` makes this row absorb whatever height the section
        has left after the optional header, and `items-center` centres the copy
        inside it — so on a `min-h-svh` frame the copy sits at the true optical
        middle whatever the viewport, while a taller-than-viewport frame still
        grows normally instead of clipping.

        `min-h-0` matters: a flex child defaults to `min-height: auto`, which
        refuses to shrink below its content. Without it, a short viewport (a
        landscape phone) would push the copy past the bottom of the frame rather
        than letting the section scroll.

        Padding is symmetric here for the same reason it was asymmetric before —
        it is what the centring is measured against.
      */}
      <div className="relative z-10 flex min-h-0 flex-1 items-center">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            {(badgeLabel || badgeText) && (
              /* The pill is upstream's and is kept for the reason upstream had
                 it: 11px tracked caps over an arbitrary photograph is a contrast
                 gamble, and the translucent ground is what makes it safe. Padding
                 tightens when there is no inner status pill to make room for. */
              <div
                className={`animate-fade-slide-in-1 mb-7 inline-flex items-center gap-3 rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur sm:mb-8 ${
                  badgeLabel ? "px-2.5 py-2" : "px-4 py-1.5"
                }`}
              >
                {badgeLabel && (
                  <span className="bg-flare-gradient inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold text-flare-ink">
                    {badgeLabel}
                  </span>
                )}
                {badgeText && (
                  /*
                    Set as an eyebrow — small, heavy, widely tracked — rather
                    than as a sentence.

                    0.2em of tracking, not the 0.16em this started at: caps have
                    no ascender/descender interlock to hold a word together, so
                    at 11px they need noticeably more space than lowercase before
                    the line stops looking cramped. Past about 0.22em it stops
                    reading as a word at all, which is the other wall.

                    `uppercase` is belt-and-braces: the English string is already
                    capitalised, and it is a no-op on the Arabic, which has no
                    case. `tabular-nums` keeps the "2024" from wobbling against
                    the caps around it — Inter's proportional 1 is much narrower
                    than its 0.
                  */
                  <span className="text-[11px] font-semibold tracking-[0.2em] text-white/80 uppercase tabular-nums">
                    {badgeText}
                  </span>
                )}
              </div>
            )}

            {/*
              `font-display` is redundant on an <h1> — the base layer in
              globals.css already hands every heading to Manrope — but it is kept
              explicit because it is also what the RTL rule keys off to swap in
              the Arabic face.

              No `animate-fade-slide-in-*` here: the heading does not fade as one
              block, its words do. The classes on the spans below replace it.
            */}
            {/*
              Three typographic corrections over the stepped Tailwind scale this
              replaces (text-4xl / sm:5xl / md:6xl / lg:7xl):

              1. FLUID SIZE. The stepped scale topped out at 72px and then stopped,
                 so on anything wider than a laptop the headline sat marooned in
                 the middle of a full-viewport frame. `clamp(2.5rem, 1.6rem +
                 4.2vw, 5.5rem)` runs 40px on a phone through ~69px on a laptop to
                 88px, and — the actual reason to prefer it — it moves CONTINUOUSLY.
                 A stepped scale jumps 12px at a breakpoint, which is visible as a
                 lurch when a window is dragged; premium type does not lurch.

              2. OPTICAL TRACKING. Tracking was a flat -0.035em at every size. It
                 cannot be: letterfit is not linear in size. The gaps a face leaves
                 at 40px are what it needs to stay legible, and the same relative
                 gaps at 88px read as loose. So it tightens as the type grows —
                 -0.018em / -0.028em / -0.038em — which is the whole of what
                 optical sizing does by hand.

              3. LEADING. 1.06 is right at 88px and too tight at 40px, where the
                 headline actually wraps to three lines and the descenders of one
                 line run into the caps of the next. It opens to 1.12 there.

              `text-balance` is the fourth: below `sm` the <br> is off and the
              browser breaks the line itself, which by default leaves a one-word
              last line. Balance evens the lines instead. It only affects the
              breaks the browser makes, so the explicit <br> above `sm` is
              untouched.
            */}
            <h1 className="font-display text-[clamp(2.5rem,1.6rem+4.2vw,5.5rem)] leading-[1.12] font-bold tracking-[-0.018em] text-balance text-white sm:leading-[1.05] sm:tracking-[-0.028em] lg:tracking-[-0.038em]">
              {line1.nodes}
              {line2 && (
                <>
                  {/* Below `sm` the <br> is `display: none` and the two lines
                      run together as one paragraph, so the space is what keeps
                      "emirate" and "before" apart. It is unconditional because
                      it costs nothing when the <br> IS shown: whitespace at the
                      end of a line box is stripped during white-space
                      processing, so the space simply disappears at that
                      breakpoint rather than widening the line. */}
                  <br className="hidden sm:block" />{" "}
                  {line2.nodes}
                </>
              )}
            </h1>

            {description && (
              /*
                `max-w-2xl` was 42rem, which at this size is ~85 characters a
                line. That is fine for text you read left-aligned and poor for
                centred text, where every line starts in a different place and the
                eye needs a short return sweep to find the next one. 34rem lands
                at ~62 characters, inside the 45–75 the measure wants.

                Leading opens with it (1.6 against Tailwind's 1.5 default): a
                wide-set centred paragraph over a photograph needs the horizontal
                channels between lines to stay obvious.

                `text-pretty` is for the last line specifically — it prevents the
                single-word orphan that a two-line paragraph produces about half
                the time.
              */
              <p className="animate-fade-slide-in-3 mx-auto mt-6 max-w-[34rem] text-[1.0625rem] leading-[1.6] tracking-[-0.003em] text-pretty text-white/80 sm:mt-7 sm:text-[1.1875rem]">
                {description}
              </p>
            )}

            {(primaryButtonText || secondaryButtonText) && (
              /*
                Both actions are `font-semibold` at 14px. They were 500 and 500,
                which left the primary — a solid gradient pill — looking lighter
                than the eyebrow above it at 600. A button label is a target, not
                prose: it should be the densest small text in the composition, not
                the least.
              */
              <div className="animate-fade-slide-in-4 mt-9 flex flex-col items-center justify-center gap-3 sm:mt-11 sm:flex-row sm:gap-4">
                {primaryButtonText && (
                  <a
                    href={primaryButtonHref}
                    className="bg-flare-gradient inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold tracking-[-0.006em] text-flare-ink shadow-[0_6px_28px_-6px_rgba(255,118,51,0.55)] transition-opacity hover:opacity-90"
                  >
                    {primaryButtonText}
                    {ARROW_FORWARD}
                  </a>
                )}
                {secondaryButtonText && (
                  <a
                    href={secondaryButtonHref}
                    className="inline-flex items-center gap-2 rounded-full bg-transparent px-6 py-3.5 text-sm font-semibold tracking-[-0.006em] text-white/85 transition-colors hover:text-white"
                  >
                    {secondaryButtonText}
                    {secondaryButtonIcon === "play" ? PLAY : ARROW_FORWARD}
                  </a>
                )}
              </div>
            )}
          </div>

          {partnersTitle && partners?.length ? (
            <div className="mx-auto mt-20 max-w-5xl">
              <p className="animate-fade-slide-in-1 text-center text-sm text-white/70">
                {partnersTitle}
              </p>
              <div className="animate-fade-slide-in-2 mt-6 grid grid-cols-2 items-center justify-items-center gap-4 text-white/70 sm:grid-cols-3 md:grid-cols-5">
                {partners.map((partner) => (
                  <a
                    key={partner.href + partner.label}
                    href={partner.href}
                    aria-label={partner.label}
                    className="inline-flex h-[36px] w-[120px] items-center justify-center rounded-full bg-cover bg-center opacity-80 transition-opacity hover:opacity-100"
                    style={{ backgroundImage: `url(${partner.logoUrl})` }}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {children}
        </div>
      </div>
    </section>
  );
};

export default ResponsiveHeroBanner;
