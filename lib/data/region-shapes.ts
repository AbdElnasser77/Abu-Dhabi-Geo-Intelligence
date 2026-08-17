/**
 * Region outlines and region-level roll-ups.
 *
 * ── READ THIS BEFORE TRUSTING THE OUTLINES ─────────────────────────────────
 * The reference package contains NO boundary geometry of any kind. These
 * rectangles are therefore NOT administrative boundaries. Each one is the
 * bounding box of that region's seed localities, padded for legibility — an
 * "operational planning envelope" in the language of `reference/01`, which
 * permits exactly this on condition that it is labelled as approximate:
 *
 *   "Load authoritative/licensed GeoJSON boundaries when available. Until then,
 *    label polygons clearly as approximate operational boundaries."
 *
 * `reference/03` ranks this last among boundary sources ("internally digitized
 * operational polygons ... labelled approximate"). So:
 *   - they are drawn dashed and translucent, never as solid filled regions;
 *   - the map carries a permanent note saying what they are;
 *   - they are never used in any calculation, filter or export.
 * Replacing them with licensed GeoJSON is the single highest-value data upgrade
 * for this product.
 *
 * The aggregates below are different in kind: population and share are official
 * SCAD figures, and the built-form / language / segment lists are unions of
 * values published per locality. Only `ppMean` is derived, and it is labelled
 * `modeled` wherever it is shown.
 */

import { AREAS, type Area } from "@/lib/data/areas";
import { EMIRATE, REGIONS, regionById, type Region } from "@/lib/data/emirate";
import {
  REGION_IDS,
  type DataStatus,
  type LanguageId,
  type RegionId,
  type SegmentId,
} from "@/lib/taxonomy";

/**
 * Padding in degrees added around the seed bounding box.
 *
 * Purely cartographic breathing room so the outline does not clip the markers it
 * contains. It is NOT an estimate of the real administrative extent — Al Dhafra
 * in particular covers far more ground than its five seed points suggest.
 */
export const ENVELOPE_PADDING_DEG = 0.22;

export type Envelope = {
  readonly west: number;
  readonly south: number;
  readonly east: number;
  readonly north: number;
};

function envelopeOf(region: RegionId): Envelope {
  const points = AREAS.filter((area) => area.region === region);
  const lats = points.map((a) => a.lat);
  const lngs = points.map((a) => a.lng);
  return {
    west: Math.min(...lngs) - ENVELOPE_PADDING_DEG,
    south: Math.min(...lats) - ENVELOPE_PADDING_DEG,
    east: Math.max(...lngs) + ENVELOPE_PADDING_DEG,
    north: Math.max(...lats) + ENVELOPE_PADDING_DEG,
  };
}

/** Computed once — the seed set is static. */
export const REGION_ENVELOPES: Record<RegionId, Envelope> = {
  abu_dhabi: envelopeOf("abu_dhabi"),
  al_ain: envelopeOf("al_ain"),
  al_dhafra: envelopeOf("al_dhafra"),
};

/**
 * GeoJSON for the outline layers. Typed structurally rather than against
 * @types/geojson, which this project does not depend on.
 */
export type RegionFeatureCollection = {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    id: number;
    properties: { region: RegionId; nameEn: string; nameAr: string };
    geometry: { type: "Polygon"; coordinates: [number, number][][] };
  }[];
};

export function regionFeatureCollection(): RegionFeatureCollection {
  return {
    type: "FeatureCollection",
    features: REGION_IDS.map((id, index) => {
      const box = REGION_ENVELOPES[id];
      const region = regionById(id);
      return {
        type: "Feature" as const,
        // Numeric ids are required for MapLibre feature-state hover.
        id: index,
        properties: { region: id, nameEn: region.name.en, nameAr: region.name.ar },
        geometry: {
          type: "Polygon" as const,
          coordinates: [
            [
              [box.west, box.south],
              [box.east, box.south],
              [box.east, box.north],
              [box.west, box.north],
              [box.west, box.south],
            ] as [number, number][],
          ],
        },
      };
    }),
  };
}

export type RegionAggregate = {
  readonly region: Region;
  readonly localityCount: number;
  /** Official SCAD figures. */
  readonly population: number;
  readonly share: number;
  readonly populationStatus: DataStatus;
  /** Derived from the localities — labelled `modeled` wherever displayed. */
  readonly ppMean: number;
  readonly ppMin: number;
  readonly ppMax: number;
  /** Unions of values published per locality, in first-seen order. */
  readonly builtForms: readonly string[];
  readonly languages: readonly LanguageId[];
  readonly segments: readonly SegmentId[];
};

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

/**
 * Rolls a region's localities up for the hover panel.
 *
 * Note what is deliberately absent: an annual growth rate. The reference package
 * publishes growth only for the emirate as a whole (SCAD's 2024 release: +7.5%),
 * never per region, so no per-region rate is shown.
 */
export function regionAggregate(id: RegionId, localities: readonly Area[] = AREAS): RegionAggregate {
  const region = regionById(id);
  const members = localities.filter((area) => area.region === id);
  const scores = members.map((area) => area.pp);

  return {
    region,
    localityCount: members.length,
    population: region.population,
    share: region.share,
    populationStatus: region.status,
    ppMean: scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
    ppMin: scores.length ? Math.min(...scores) : 0,
    ppMax: scores.length ? Math.max(...scores) : 0,
    builtForms: unique(members.map((area) => area.areaType.en)),
    languages: unique(members.flatMap((area) => area.languages)),
    segments: unique(members.flatMap((area) => area.segments)),
  };
}

/** Emirate-level growth, the only growth figure the source publishes. */
export const EMIRATE_GROWTH_PERCENT = 7.5;

export const EMIRATE_TOTAL = EMIRATE.population;

export const REGION_COUNT = REGIONS.length;
