"use client";

import { useEffect } from "react";

import { dir, htmlLang } from "@/lib/i18n";
import type { Lang } from "@/lib/taxonomy";

/**
 * Keeps `<html lang>` and `<html dir>` in step with the active interface
 * language.
 *
 * Visual direction is already handled by the wrapper element the page renders
 * server-side, so this is not about layout — it is about assistive technology.
 * Screen readers pick pronunciation and reading order from the document root,
 * and the root layout cannot read `searchParams` to set them itself.
 */
export function DocumentLang({ lang }: { lang: Lang }) {
  useEffect(() => {
    const root = document.documentElement;
    root.lang = htmlLang(lang);
    root.dir = dir(lang);
  }, [lang]);

  return null;
}
