"use client";

import { useEffect } from "react";

/**
 * Makes the scroll reveals work in browsers without scroll-driven animations.
 *
 * The reveals are CSS `animation-timeline: view()`, which is Chromium-only for
 * now — Firefox and Safari shipped it only very recently, and anything older
 * simply skipped the whole `@supports` block. The result was content that
 * rendered fine but never animated, which is exactly the "it doesn't work" case.
 *
 * Two things make this safe rather than the usual JS-reveal trap:
 *
 *  - **The hidden state is applied by JS, not by the stylesheet.** The CSS only
 *    hides these elements under `[data-reveal-fallback]`, an attribute this sets
 *    on <html>. So if JS never runs, or fails, every section stays visible. A
 *    stylesheet that hides content and waits for script is how pages end up
 *    permanently blank.
 *  - **It does nothing where the CSS already works,** so supporting browsers keep
 *    the compositor-driven version and never pay for an observer.
 *
 * Reduced motion is honoured here too: those readers get the content with no
 * animation at all, which is the same thing the CSS path gives them.
 */
export function RevealFallback() {
  useEffect(() => {
    if (typeof CSS !== "undefined" && CSS.supports("animation-timeline", "view()")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = document.querySelectorAll<HTMLElement>(
      ".reveal-on-scroll, .reveal-fade, .reveal-stagger > *",
    );
    if (targets.length === 0) return;

    // Only now is it safe for the CSS to hide anything.
    document.documentElement.dataset.revealFallback = "";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          // One-shot: re-hiding on the way back up reads as a flicker, and the
          // CSS version does not do it either once the range is passed.
          observer.unobserve(entry.target);
        }
      },
      // A little short of the bottom edge, so the reveal starts as the element
      // arrives rather than the instant its first pixel appears.
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    for (const el of targets) observer.observe(el);

    // Anything already on screen at mount should not wait for a scroll.
    return () => observer.disconnect();
  }, []);

  return null;
}
