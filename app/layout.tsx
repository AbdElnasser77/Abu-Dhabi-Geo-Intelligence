import type { Metadata, Viewport } from "next";
import { Geist_Mono, IBM_Plex_Sans_Arabic, Inter, Manrope } from "next/font/google";
// Order is load-bearing and all three steps matter. CSS order follows import
// order, so verify with `next build` as well as `next dev` — the two can differ.
//   1. Tailwind preflight + brand theme.
import "./globals.css";
//   2. Vendor, after preflight, so preflight's button/svg resets do not strip
//      MapLibre's own controls.
import "maplibre-gl/dist/maplibre-gl.css";
//   3. Our overrides, after vendor, so they win without needing !important.
import "./map-overrides.css";

// Body and UI. Inter is the workhorse: dense tabular figures, a real `tnum`
// feature and tight small sizes, which is what the KPI cards and the results
// table are made of.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Headings and the hero display line. Manrope's higher x-height and closed
// apertures hold up at `text-7xl` where Inter goes generic, and its 800 weight
// gives the section headings somewhere to go that Inter's 700 does not.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Neither Inter nor Manrope has Arabic coverage, so RTL mode needs a real
// Arabic face — see the `[dir="rtl"]` rules in globals.css, which also hand the
// display headings back to this face rather than letting them fall through to
// whatever the OS picks.
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Abu Dhabi Geo-Intelligence",
  description:
    "Interactive geographic, demographic and market-intelligence map for the Emirate of Abu Dhabi. Official SCAD 2024 emirate and region totals with qualitative locality profiles.",
};

/**
 * `themeColor` in `metadata` has been deprecated since Next 14 and is ignored —
 * it belongs here. Both entries earn their place on a dark UI:
 *
 *  - `colorScheme: "dark"` is what makes the browser render form controls,
 *    scrollbars and the canvas behind the document in their dark variants. Without
 *    it, native scrollbars stay light-grey against a black page.
 *  - `themeColor` stops the flash of white the browser otherwise paints under the
 *    document before the first frame.
 */
export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // `components/document-lang.tsx` sets lang and dir on this element from the
      // client, because a layout cannot read `searchParams` to know the language.
      // Client-mutated <html> attributes are the documented case for this flag; it
      // applies only to this element, never to its children.
      suppressHydrationWarning
      className={`${inter.variable} ${manrope.variable} ${geistMono.variable} ${plexArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
