"use client";

// maplibre-gl v6 is ESM with named exports only — there is no default export.
// `Map` is imported under its `MapLibreMap` alias so it does not shadow the
// global `Map` used for the marker registry below.
import {
  FullscreenControl,
  GeolocateControl,
  LngLatBounds,
  MapLibreMap,
  Marker,
  NavigationControl,
  Popup,
  ScaleControl,
  setWorkerUrl,
  type IControl,
} from "maplibre-gl";
import { useEffect, useEffectEvent, useRef } from "react";

import { showsScoreDigit, swatchFor } from "@/lib/colors";
import { AREAS, type Area } from "@/lib/data/areas";
import { EMIRATE_VIEW, regionById } from "@/lib/data/emirate";
import { regionFeatureCollection } from "@/lib/data/region-shapes";
import { bi, t } from "@/lib/i18n";
import { buildStyle, FIT_PADDING, MAX_FIT_ZOOM, MAX_ZOOM, WORKER_URL } from "@/lib/map-style";
import {
  CATEGORY_LABELS,
  DATA_STATUS_LABELS,
  LANGUAGE_LABELS,
  PP_LABELS,
  REGION_LABELS,
  SEGMENT_LABELS,
  type Lang,
  type RegionId,
  type ThematicLayer,
} from "@/lib/taxonomy";

/**
 * The MapLibre instance.
 *
 * This module is only ever reached through `map-shell.tsx`, which imports it via
 * `dynamic(..., { ssr: false })`. It must never be imported directly from a
 * Server Component.
 *
 * Localities are rendered as HTML markers rather than symbol layers. That is a
 * deliberate choice and it buys four things at once: markers become real
 * focusable `<button>`s, the purchasing-power digit can sit inside the disc as
 * `reference/09` requires, Arabic text is shaped by the browser so MapLibre's
 * CDN-loaded RTL text plugin is never needed, and hover/selected states are plain
 * CSS.
 */

/**
 * Override MapLibre's worker URL before any map is constructed. See the comment
 * on WORKER_URL — Turbopack mis-resolves MapLibre's own lookup, which otherwise
 * makes the map fail to start with a module-script MIME error.
 *
 * Module scope is correct: this file is only ever evaluated in the browser
 * (it is reached through `dynamic(..., { ssr: false })`), and the URL must be in
 * place before the first `new MapLibreMap(...)`.
 */
setWorkerUrl(WORKER_URL);

type MarkerHandle = {
  readonly marker: Marker;
  readonly wrapper: HTMLDivElement;
  readonly button: HTMLButtonElement;
};

type ClusterHandle = {
  readonly marker: Marker;
  readonly wrapper: HTMLDivElement;
  readonly button: HTMLButtonElement;
  /** Mutable: the pool is reused across camera moves. */
  members: Area[];
};

/**
 * Screen-space distance below which two features are folded together.
 *
 * 40px, not the 34px marker diameter: a two-digit cluster bubble is wider than a
 * marker and carries a 4px outer ring, so the worst-case pair is a ~44px bubble
 * beside a 34px disc — half-widths 22 + 17 = 39. Anything less and a bubble can
 * still land on top of an unrelated marker.
 */
const CLUSTER_RADIUS_PX = 40;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * MapLibre GL v5+ dropped WebGL 1 and requires WebGL 2. When it is unavailable
 * the constructor throws, so probe first and report a cause the reader can act
 * on rather than letting a blank container stand there silently.
 */
function webgl2Unavailable(): boolean {
  try {
    return document.createElement("canvas").getContext("webgl2") == null;
  } catch {
    return true;
  }
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export default function MapCanvas({
  lang,
  direction,
  layer,
  visibleIds,
  selectedId,
  soleRegion,
  onSelect,
  onReady,
  onError,
  onTileTrouble,
  onClusterInfo,
  onRegionSelect,
}: {
  lang: Lang;
  direction: "ltr" | "rtl";
  layer: ThematicLayer;
  visibleIds: ReadonlySet<string>;
  selectedId: string | null;
  soleRegion: RegionId | null;
  onSelect: (id: string | null) => void;
  onReady: () => void;
  onError: (detail: string, kind: "webgl" | "construct") => void;
  onTileTrouble: () => void;
  onClusterInfo: (groupedAreas: number, clusterCount: number) => void;
  onRegionSelect: (region: RegionId | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Map<string, MarkerHandle>>(new Map());
  const clustersRef = useRef<ClusterHandle[]>([]);
  const popupRef = useRef<Popup | null>(null);
  // Guards the camera effect so it only reacts to query changes, never to a
  // re-render — otherwise every keystroke would yank the map away from the user.
  const lastFitRef = useRef<string>("");
  const controlsRef = useRef<IControl[]>([]);

  // Stable handles that always see the latest props. This is what lets the map be
  // created exactly once no matter how often the parent re-renders — the
  // alternative, writing props into a ref during render, is not allowed.
  //
  // Optional-call syntax despite the props being required in the type: TypeScript
  // enforces the contract at build time, but this component sits behind a
  // `dynamic()` boundary, and during dev HMR the shell and the canvas can briefly
  // be different versions of each other. Without the guard that mismatch throws
  // "onReady is not a function" and takes the whole map down until a manual reload.
  const selectArea = useEffectEvent((id: string | null) => onSelect?.(id));
  const reportReady = useEffectEvent(() => onReady?.());
  const reportError = useEffectEvent((detail: string, kind: "webgl" | "construct") =>
    onError?.(detail, kind),
  );
  const reportTileTrouble = useEffectEvent(() => onTileTrouble?.());
  const reportClusters = useEffectEvent((grouped: number, count: number) =>
    onClusterInfo?.(grouped, count),
  );
  const reportRegionSelect = useEffectEvent((region: RegionId | null) =>
    onRegionSelect?.(region),
  );

  /**
   * A bare click on the map, resolved in priority order.
   *
   * Region outlines open on CLICK, not on hover: a hover-driven panel swaps its
   * contents every time the pointer crosses an outline and empties itself the
   * moment the pointer leaves, so nothing stays readable. Hover now only
   * highlights the outline and shows a pointer cursor as the affordance.
   */
  const handleMapClick = useEffectEvent((point: { x: number; y: number }) => {
    const map = mapRef.current;
    if (!map) return;

    // An open locality profile takes precedence — reference/03 asks a bare click
    // to "deselect one level" rather than jumping straight to a different subject.
    if (selectedId) {
      selectArea(null);
      return;
    }
    if (!map.getLayer("region-fill")) return;
    const hits = map.queryRenderedFeatures([point.x, point.y], { layers: ["region-fill"] });
    reportRegionSelect(hits.length ? ((hits[0].properties?.region as RegionId) ?? null) : null);
  });

  // --- hover / focus popup -------------------------------------------------

  const hidePopup = useEffectEvent(() => {
    popupRef.current?.remove();
  });

  /** Concise detail card for one locality (reference/03 "Hover: outline + tooltip"). */
  const showAreaPopup = useEffectEvent((area: Area) => {
    const map = mapRef.current;
    const popup = popupRef.current;
    if (!map || !popup) return;

    const body = el("div", "ad-popup-body");
    body.dir = direction;

    const head = el("div", "ad-popup-head");
    const { fill, text } = swatchFor(area, layer);
    const badge = el("span", "ad-popup-badge", String(area.pp));
    badge.style.backgroundColor = fill;
    badge.style.color = text;
    badge.setAttribute("aria-hidden", "true");
    const names = el("div");
    names.appendChild(el("p", "ad-popup-name", lang === "ar" ? area.nameAr : area.nameEn));
    const alt = el("p", "ad-popup-alt", lang === "ar" ? area.nameEn : area.nameAr);
    // The secondary name is in the other script, so it needs the other direction.
    alt.dir = lang === "ar" ? "ltr" : "rtl";
    names.appendChild(alt);
    head.append(badge, names);
    body.appendChild(head);

    const rows: [string, string][] = [
      [t("parentRegion", lang), bi(REGION_LABELS[area.region], lang)],
      [
        t("areaCategory", lang),
        `${bi(CATEGORY_LABELS[area.category], lang)} · ${bi(area.areaType, lang)}`,
      ],
      [
        t("purchasingPower", lang),
        `${area.pp}/5 · ${bi(PP_LABELS[area.pp], lang)}`,
      ],
      [t("densityProfileLabel", lang), bi(area.densityProfile, lang)],
      [
        t("priorityLanguages", lang),
        area.languages.map((id) => bi(LANGUAGE_LABELS[id], lang)).join(", "),
      ],
      [
        t("communitySegments", lang),
        area.segments.map((id) => bi(SEGMENT_LABELS[id], lang)).join(", "),
      ],
      // Every popup carries the data status, same rule as everywhere else.
      [t("dataStatusLabel", lang), bi(DATA_STATUS_LABELS[area.dataStatus], lang)],
    ];
    const grid = el("dl", "ad-popup-grid");
    for (const [label, value] of rows) {
      grid.appendChild(el("dt", undefined, label));
      grid.appendChild(el("dd", undefined, value));
    }
    body.appendChild(grid);
    body.appendChild(el("p", "ad-popup-hint", t("openProfileHint", lang)));

    popup.setDOMContent(body).setLngLat([area.lng, area.lat]).addTo(map);
  });

  /** What a cluster is standing in for, so hovering one is not a dead end. */
  const showClusterPopup = useEffectEvent((handle: ClusterHandle) => {
    const map = mapRef.current;
    const popup = popupRef.current;
    if (!map || !popup || handle.members.length === 0) return;

    const body = el("div", "ad-popup-body");
    body.dir = direction;
    body.appendChild(
      el("p", "ad-popup-name", `${handle.members.length} ${t("clusterOfAreas", lang)}`),
    );

    const list = el("ul", "ad-popup-list");
    for (const area of handle.members.slice(0, 8)) {
      list.appendChild(
        el(
          "li",
          undefined,
          `${lang === "ar" ? area.nameAr : area.nameEn} · ${t("purchasingPower", lang)} ${area.pp}/5`,
        ),
      );
    }
    if (handle.members.length > 8) {
      list.appendChild(el("li", undefined, `+ ${handle.members.length - 8}`));
    }
    body.appendChild(list);
    body.appendChild(el("p", "ad-popup-hint", t("clusterActivate", lang)));

    popup.setDOMContent(body).setLngLat(handle.marker.getLngLat()).addTo(map);
  });

  const zoomToCluster = useEffectEvent((handle: ClusterHandle) => {
    const map = mapRef.current;
    if (!map || handle.members.length === 0) return;
    hidePopup();

    const bounds = new LngLatBounds();
    for (const area of handle.members) bounds.extend([area.lng, area.lat]);
    map.fitBounds(bounds, {
      padding: FIT_PADDING,
      // One notch past the current zoom at minimum, so a cluster of coincident
      // points still separates instead of re-clustering at the same scale.
      maxZoom: Math.max(map.getZoom() + 2, 11),
      duration: prefersReducedMotion() ? 0 : 600,
    });
  });

  // --- clustering ----------------------------------------------------------

  /**
   * Folds markers that would overlap on screen into count bubbles.
   *
   * `reference/01` asks for this ("cluster markers at low zoom and progressively
   * reveal districts at higher zoom") and `reference/15 §4` permits the map's
   * feature count to diverge from the directory row count for exactly this reason
   * — "subject only to declared marker clustering at low zoom". The divergence is
   * therefore reported upward and shown to the reader, never left implicit.
   *
   * Runs on every camera move. It is a greedy single pass over at most 25 points,
   * which is far cheaper than the render it feeds.
   */
  const recluster = useEffectEvent(() => {
    const map = mapRef.current;
    if (!map) return;

    const projected = AREAS.filter((area) => visibleIds.has(area.id)).map((area) => ({
      area,
      pt: map.project([area.lng, area.lat]),
    }));

    type Item = (typeof projected)[number];
    type Group = { items: Item[]; cx: number; cy: number; pinned: boolean };

    const centre = (items: Item[]) => ({
      cx: items.reduce((sum, item) => sum + item.pt.x, 0) / items.length,
      cy: items.reduce((sum, item) => sum + item.pt.y, 0) / items.length,
    });

    /**
     * Merges the first colliding pair found, or returns null when nothing collides.
     *
     * Agglomerative rather than a single greedy pass, because a bubble is drawn at
     * its members' centroid — a position none of them occupied. That centroid can
     * land on top of a marker that was never close to any original member, which is
     * exactly how one area (Liwa) stayed unclickable under the first implementation.
     * Repeating until nothing collides is what actually guarantees the result.
     */
    const mergeOnce = (list: Group[]): Group[] | null => {
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          // The selected area is never folded in: its profile is open, so its marker
          // must stay visible and carry the selection ring.
          if (list[i].pinned || list[j].pinned) continue;
          const gap = Math.hypot(list[i].cx - list[j].cx, list[i].cy - list[j].cy);
          if (gap > CLUSTER_RADIUS_PX) continue;
          const items = [...list[i].items, ...list[j].items];
          const next = list.filter((_, index) => index !== i && index !== j);
          next.push({ items, ...centre(items), pinned: false });
          return next;
        }
      }
      return null;
    };

    let groups: Group[] = projected.map((item) => ({
      items: [item],
      ...centre([item]),
      pinned: item.area.id === selectedId,
    }));
    // Each pass removes one group, so `projected.length` iterations is a hard
    // ceiling — the loop cannot run away even if the geometry is degenerate.
    for (let guard = 0; guard < projected.length; guard++) {
      const next = mergeOnce(groups);
      if (!next) break;
      groups = next;
    }

    const standalone = new Set<string>();
    const clustered: Group[] = [];
    for (const group of groups) {
      if (group.items.length === 1) standalone.add(group.items[0].area.id);
      else clustered.push(group);
    }

    // Individual markers: visible only when they are not standing in a cluster.
    for (const area of AREAS) {
      const handle = markersRef.current.get(area.id);
      if (handle) handle.wrapper.hidden = !standalone.has(area.id);
    }

    // Grow the cluster pool on demand and reuse it thereafter — recreating markers
    // on every frame of a pan would thrash the DOM.
    while (clustersRef.current.length < clustered.length) {
      const wrapper = el("div", "ad-marker-wrap");
      const button = el("button", "ad-cluster");
      button.type = "button";
      wrapper.appendChild(button);
      const marker = new Marker({ element: wrapper, anchor: "center" })
        .setLngLat([0, 0])
        .addTo(map);
      const handle: ClusterHandle = { marker, wrapper, button, members: [] };
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        zoomToCluster(handle);
      });
      button.addEventListener("mouseenter", () => showClusterPopup(handle));
      button.addEventListener("focus", () => showClusterPopup(handle));
      button.addEventListener("mouseleave", () => hidePopup());
      button.addEventListener("blur", () => hidePopup());
      clustersRef.current.push(handle);
    }

    clustered.forEach((group, index) => {
      const handle = clustersRef.current[index];
      handle.members = group.items.map((item) => item.area);
      handle.marker.setLngLat(map.unproject([group.cx, group.cy]));
      handle.button.textContent = String(group.items.length);
      const names = handle.members
        .map((area) => (lang === "ar" ? area.nameAr : area.nameEn))
        .join(", ");
      const label = `${group.items.length} ${t("clusterOfAreas", lang)}: ${names}. ${t("clusterActivate", lang)}`;
      handle.button.title = label;
      handle.button.setAttribute("aria-label", label);
      handle.wrapper.hidden = false;
    });
    for (let i = clustered.length; i < clustersRef.current.length; i++) {
      clustersRef.current[i].wrapper.hidden = true;
      clustersRef.current[i].members = [];
    }

    const groupedAreas = clustered.reduce((sum, group) => sum + group.items.length, 0);
    reportClusters(groupedAreas, clustered.length);
  });

  // --- create the map, the popup and all 25 markers, once ------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Captured locally: reading `markersRef.current` from the cleanup closure
    // would read whatever the ref holds at teardown, not what this effect built.
    const markers = markersRef.current;
    const clusters = clustersRef.current;

    if (webgl2Unavailable()) {
      reportError("WebGL 2 context unavailable", "webgl");
      return;
    }

    const initial = soleRegion ? regionById(soleRegion) : null;
    let map: MapLibreMap;
    try {
      map = new MapLibreMap({
        container,
        style: buildStyle(),
        center: initial
          ? [initial.center.lng, initial.center.lat]
          : [EMIRATE_VIEW.center.lng, EMIRATE_VIEW.center.lat],
        zoom: initial ? initial.zoom : EMIRATE_VIEW.zoom,
        maxZoom: MAX_ZOOM,
        // Keep the default attribution control: reference/03's QA checklist
        // requires visible attribution, so it must not be removable by accident.
      });
    } catch (cause) {
      reportError(cause instanceof Error ? cause.message : String(cause), "construct");
      return;
    }
    mapRef.current = map;

    // `focusAfterOpen: false` matters for keyboard users — the popup opens on
    // marker focus, and letting it grab focus would bounce the user out of the
    // marker they just tabbed to.
    popupRef.current = new Popup({
      closeButton: false,
      closeOnClick: false,
      focusAfterOpen: false,
      anchor: "bottom",
      offset: 22,
      className: "ad-popup",
      maxWidth: "320px",
    });

    // `load` is the only reliable signal that the style resolved and the first
    // frame rendered — without it the shell cannot tell "slow" from "broken".
    map.on("load", () => {
      /*
       * Region outlines. These are APPROXIMATE operational envelopes, not
       * administrative boundaries — see lib/data/region-shapes.ts. Drawn dashed and
       * translucent so they never read as authoritative geometry, and the map
       * carries a permanent note saying so.
       */
      map.addSource("regions", { type: "geojson", data: regionFeatureCollection() });
      map.addLayer({
        id: "region-fill",
        type: "fill",
        source: "regions",
        paint: {
          "fill-color": "#0B7A53",
          // Hover is driven by feature-state so it costs no source re-upload.
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.1,
            0.03,
          ],
        },
      });
      map.addLayer({
        id: "region-line",
        type: "line",
        source: "regions",
        paint: {
          "line-color": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            "#C8102E",
            "#0B7A53",
          ],
          "line-width": ["case", ["boolean", ["feature-state", "hover"], false], 2.5, 1.5],
          "line-dasharray": [4, 3],
          "line-opacity": 0.9,
        },
      });

      let hovered: number | null = null;
      const clearHover = () => {
        if (hovered !== null) {
          map.setFeatureState({ source: "regions", id: hovered }, { hover: false });
          hovered = null;
        }
      };
      map.on("mousemove", "region-fill", (event) => {
        const feature = event.features?.[0];
        if (!feature || feature.id === undefined) return;
        const id = Number(feature.id);
        if (hovered === id) return;
        if (hovered !== null) {
          map.setFeatureState({ source: "regions", id: hovered }, { hover: false });
        }
        hovered = id;
        map.setFeatureState({ source: "regions", id }, { hover: true });
        // Pointer cursor is the affordance that says "this is clickable".
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "region-fill", () => {
        map.getCanvas().style.cursor = "";
        clearHover();
      });

      reportReady();
      recluster();
    });

    // Tile failures are common and non-fatal (one dropped request, an offline
    // moment). They are surfaced as a non-blocking notice rather than replacing a
    // working map, because marker positions remain correct without the basemap.
    map.on("error", (event) => {
      const message = event?.error?.message ?? "";
      if (/tile|fetch|network|load image|abort/i.test(message)) reportTileTrouble();
      else reportError(message || "MapLibre reported an error", "construct");
    });

    // Regroup as the camera moves. `move` rather than `moveend` so bubbles track
    // the pan instead of snapping into place when it stops.
    map.on("move", () => recluster());

    // Region outlines open here, on click. See handleMapClick for the ordering.
    map.on("click", (event) => handleMapClick(event.point));

    for (const area of AREAS) {
      const wrapper = el("div", "ad-marker-wrap");
      const button = el("button", "ad-marker");
      button.type = "button";
      // Inner span: the pin shape is a rotated square-with-one-sharp-corner, so the
      // label has to be counter-rotated inside it.
      button.appendChild(el("span", "ad-marker-glyph"));
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        selectArea(area.id);
      });
      // Hover for pointers, focus for keyboards — same detail card either way.
      button.addEventListener("mouseenter", () => showAreaPopup(area));
      button.addEventListener("focus", () => showAreaPopup(area));
      button.addEventListener("mouseleave", () => hidePopup());
      button.addEventListener("blur", () => hidePopup());
      wrapper.appendChild(button);

      // `bottom` because the pin's tip is at its bottom edge — anchoring at the
      // centre would place the coordinate in the middle of the disc.
      const marker = new Marker({ element: wrapper, anchor: "bottom", offset: [0, 4] })
        .setLngLat([area.lng, area.lat])
        .addTo(map);

      markers.set(area.id, { marker, wrapper, button });
    }

    return () => {
      popupRef.current?.remove();
      popupRef.current = null;
      for (const handle of markers.values()) handle.marker.remove();
      markers.clear();
      for (const handle of clusters) handle.marker.remove();
      clusters.length = 0;
      controlsRef.current = [];
      map.remove();
      mapRef.current = null;
    };
    // Intentionally mount-only. `soleRegion` is read for the opening view and
    // handled thereafter by the camera effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- controls, re-placed when direction flips ----------------------------
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const control of controlsRef.current) map.removeControl(control);

    const near = direction === "rtl" ? "top-left" : "top-right";
    const far = direction === "rtl" ? "bottom-right" : "bottom-left";

    const controls: IControl[] = [
      new NavigationControl({ showCompass: true, visualizePitch: false }),
      new GeolocateControl({ trackUserLocation: false }),
      new FullscreenControl(),
      new ScaleControl({ maxWidth: 110, unit: "metric" }),
    ];
    map.addControl(controls[0], near);
    map.addControl(controls[1], near);
    map.addControl(controls[2], near);
    map.addControl(controls[3], far);
    controlsRef.current = controls;
  }, [direction]);

  // --- marker appearance: colour, selection, labels ------------------------
  // Visibility is deliberately NOT set here — `recluster` owns it, so the two do
  // not fight over the same `hidden` flag.
  useEffect(() => {
    for (const area of AREAS) {
      const handle = markersRef.current.get(area.id);
      if (!handle) continue;

      const { fill, text } = swatchFor(area, layer);
      handle.button.style.backgroundColor = fill;
      handle.button.style.color = text;
      // The score digit belongs in the pin only while colour encodes purchasing
      // power; on other layers it would imply the fill means something it doesn't.
      const glyph = handle.button.querySelector("span");
      if (glyph) glyph.textContent = showsScoreDigit(layer) ? String(area.pp) : "";

      const name = lang === "ar" ? area.nameAr : area.nameEn;
      const description = [
        name,
        bi(CATEGORY_LABELS[area.category], lang),
        `${t("purchasingPower", lang)} ${area.pp}/5 · ${bi(PP_LABELS[area.pp], lang)}`,
      ].join(" — ");
      handle.button.title = description;
      handle.button.setAttribute("aria-label", description);
      handle.button.dataset.selected = String(selectedId === area.id);
      handle.button.setAttribute("aria-pressed", String(selectedId === area.id));
    }
    // Visibility depends on the camera as well as the query, so regroup here too —
    // a filter change can leave markers that no longer need to be clustered.
    recluster();
  }, [layer, visibleIds, selectedId, lang]);

  // --- camera: react to the query, not to renders --------------------------
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const visible = AREAS.filter((area) => visibleIds.has(area.id));
    const signature = `${soleRegion ?? "all"}|${visible.map((a) => a.id).join(",")}`;
    if (signature === lastFitRef.current) return;
    lastFitRef.current = signature;

    // Zero matches: hold the current geographic frame (reference/03).
    if (visible.length === 0) return;

    const animate = !prefersReducedMotion();

    if (soleRegion) {
      // A regional query retains regional context rather than zooming to results.
      const region = regionById(soleRegion);
      const target = {
        center: [region.center.lng, region.center.lat] as [number, number],
        zoom: region.zoom,
      };
      if (animate) map.easeTo({ ...target, duration: 700 });
      else map.jumpTo(target);
      return;
    }

    const bounds = new LngLatBounds();
    for (const area of visible) bounds.extend([area.lng, area.lat]);
    map.fitBounds(bounds, {
      padding: FIT_PADDING,
      maxZoom: MAX_FIT_ZOOM,
      duration: animate ? 700 : 0,
    });
  }, [visibleIds, soleRegion]);

  // --- centre the selected area so the drawer cannot hide it ---------------
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const area = AREAS.find((candidate) => candidate.id === selectedId);
    if (!area) return;

    const zoom = Math.max(map.getZoom(), 11);
    if (prefersReducedMotion()) map.jumpTo({ center: [area.lng, area.lat], zoom });
    else map.easeTo({ center: [area.lng, area.lat], zoom, duration: 600 });
  }, [selectedId]);

  // --- reflow when the drawer or filter rail changes the available width ----
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => mapRef.current?.resize());
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      // Positioned by `.ad-map-container` in app/map-overrides.css, NOT by
      // Tailwind's `absolute inset-0`. MapLibre stamps its own `maplibregl-map`
      // class on this element, and that vendor rule sets `position: relative` from
      // a stylesheet imported after Tailwind — it wins at equal specificity and
      // collapses the container to height 0. See the comment on the class.
      className="ad-map-container"
      role="application"
      aria-label={t("mapLabel", lang)}
    />
  );
}
