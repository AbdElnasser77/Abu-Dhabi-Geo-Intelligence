/**
 * The sub-path the site is served under (e.g. `/Abu-Dhabi-Geo-Intelligence` on
 * GitHub Pages), or `""` when it is served from the domain root.
 *
 * `next/link` applies `basePath` automatically, but raw URLs do not: a plain
 * `<img src>`, a CSS `url()`, or the MapLibre worker URL. Anything under
 * `public/` referenced that way must go through `withBasePath()`.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-relative public path ("/hero/x.jpg") with the base path. */
export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
