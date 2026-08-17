import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
// Order is load-bearing and all three steps matter. CSS order follows import
// order, so verify with `next build` as well as `next dev` — the two can differ.
//   1. Tailwind preflight + brand theme.
import "./globals.css";
//   2. Vendor, after preflight, so preflight's button/svg resets do not strip
//      MapLibre's own controls.
import "maplibre-gl/dist/maplibre-gl.css";
//   3. Our overrides, after vendor, so they win without needing !important.
import "./map-overrides.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Geist has no Arabic coverage, so RTL mode needs a real Arabic face.
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // `components/document-lang.tsx` sets lang and dir on this element from the
      // client, because a layout cannot read `searchParams` to know the language.
      // Client-mutated <html> attributes are the documented case for this flag; it
      // applies only to this element, never to its children.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${plexArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
