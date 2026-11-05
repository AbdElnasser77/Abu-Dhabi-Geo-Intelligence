import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 *
 * `output: "export"` writes plain HTML/CSS/JS to `out/` — there is no Node
 * server on Pages, so nothing on the page may read the request at runtime (see
 * `app/page.tsx`: the language is read from the URL on the client instead).
 *
 * A project site is served from `https://<user>.github.io/<repo>/`, so the build
 * needs that sub-path as `basePath`. It comes from `NEXT_PUBLIC_BASE_PATH`, which
 * the deploy workflow sets; locally it is empty and the site serves from `/`.
 * `NEXT_PUBLIC_` so the same value is inlined into the client bundle for the
 * URLs `next/link` does not rewrite on its own — see `lib/base-path.ts`.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // Emit `index.html` per folder so Pages serves every route without rewrites.
  trailingSlash: true,
};

export default nextConfig;
