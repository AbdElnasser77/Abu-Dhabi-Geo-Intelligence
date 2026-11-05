"use client";

import { useEffect } from "react";

import { dir, htmlLang, t } from "@/lib/i18n";
import type { Lang } from "@/lib/taxonomy";

/**
 * Keeps `<html lang>`, `<html dir>` and the document title in step with the
 * active interface language.
 *
 * Visual direction is already handled by the wrapper element `PageBody` renders,
 * so this is not about layout — it is about assistive technology. Screen readers
 * pick pronunciation and reading order from the document root, and the root
 * layout cannot know the language: the site is a static export, prerendered in
 * English, and `?lang=` is only known in the browser. For the same reason the
 * static `metadata` title is English and is swapped here.
 */
export function DocumentLang({ lang }: { lang: Lang }) {
  useEffect(() => {
    const root = document.documentElement;
    root.lang = htmlLang(lang);
    root.dir = dir(lang);
    document.title = t("brand", lang);
  }, [lang]);

  return null;
}
