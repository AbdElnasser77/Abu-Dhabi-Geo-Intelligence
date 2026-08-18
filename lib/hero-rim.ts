/**
 * The luminous rim of `public/hero/cosmos-limb.jpg`, traced from the image.
 *
 * This is not hand-drawn. A ridge *follower* walks the line in arc-length steps,
 * at each step searching along the local normal for the sharpest crossing —
 * brightest relative to what sits ±7px either side of it, which rejects the broad
 * bloom because the bloom is locally flat. It steers from a smoothed history of
 * the last dozen steps, so one noisy correction cannot swing the heading, and it
 * samples bilinearly so it can move sub-pixel in any direction.
 *
 * That last part is why it works where the first two attempts did not. Earlier
 * versions scanned whole columns and kept anything above a fixed brightness, so
 * they simply lost the line where the limb goes dark (#3e090d against black) and
 * the curve had to be extrapolated into the top-left — which was visibly off.
 * The follower tracks that stretch instead: 1,067 points from x=4 to x=3527 with
 * **zero** steps where the ridge could not be found, faint section included.
 *
 * Accuracy against the followed pixels, in the image's own 3840px-wide space:
 * mean 3.0px, max 8.8px — about 1.5px and 4.4px at 1080p. Over the first 20% of
 * the curve, the top-left specifically, mean 3.0px / 1.5px at 1080p. For contrast
 * the previous attempt was 43px max, and a hand-fitted single cubic was 180px out
 * at 1080p at both ends. A single circular arc does not fit at all — the rim is
 * not circular under this crop (60px mean residual).
 *
 * Both ends are then carried out along the local tangent: the start to exactly
 * x=0, so the line begins at the edge of the frame rather than 190px inside it,
 * and the end just past y=2152 so it leaves the frame instead of stopping short.
 *
 * If the background image is ever replaced this must be re-traced; it is
 * meaningless against a different photograph.
 */

export type GradientStop = { readonly offset: string; readonly color: string };

export const HERO_RIM = {
  /** Must match the image's own pixel dimensions, not a rounded 16:9. */
  viewBox: "0 0 3840 2152",

  /** Where the dot ignites — the left edge — and where the line exits the frame. */
  start: [0, 147] as const,
  end: [3534, 2160] as const,

  pathD:
    "M 0.0 146.8 " +
    "C 61.6 145.9, 124.6 143.6, 184.7 144.2 " +
    "C 244.8 144.7, 301.4 146.8, 360.7 150.0 " +
    "C 420.0 153.2, 481.3 157.2, 540.4 163.6 " +
    "C 599.4 170.0, 657.4 180.2, 714.9 188.5 " +
    "C 772.5 196.9, 828.4 203.7, 885.7 213.6 " +
    "C 943.0 223.6, 1001.1 235.8, 1058.6 248.2 " +
    "C 1116.0 260.7, 1172.8 273.3, 1230.3 288.2 " +
    "C 1287.8 303.1, 1346.7 320.5, 1403.5 337.7 " +
    "C 1460.3 355.0, 1516.5 371.9, 1571.1 391.7 " +
    "C 1625.8 411.4, 1681.7 435.2, 1731.3 456.3 " +
    "C 1780.9 477.3, 1820.2 494.5, 1868.9 517.7 " +
    "C 1917.5 541.0, 1976.5 572.9, 2023.0 596.0 " +
    "C 2069.6 619.0, 2107.4 632.8, 2148.0 656.2 " +
    "C 2188.6 679.6, 2223.1 706.7, 2266.6 736.3 " +
    "C 2310.0 766.0, 2361.5 800.5, 2408.9 834.1 " +
    "C 2456.3 867.8, 2504.5 902.4, 2551.0 938.3 " +
    "C 2597.5 974.1, 2643.2 1011.1, 2688.0 1049.1 " +
    "C 2732.8 1087.1, 2777.2 1125.8, 2819.8 1166.3 " +
    "C 2862.4 1206.8, 2903.0 1248.6, 2943.4 1292.1 " +
    "C 2983.8 1335.6, 3024.9 1382.8, 3062.4 1427.3 " +
    "C 3099.8 1471.8, 3134.4 1515.3, 3168.0 1559.2 " +
    "C 3201.5 1603.1, 3232.2 1645.3, 3263.6 1690.7 " +
    "C 3295.0 1736.2, 3325.9 1782.5, 3356.3 1832.0 " +
    "C 3386.8 1881.6, 3416.6 1933.4, 3446.3 1988.0 " +
    "C 3475.9 2042.7, 3505.0 2102.7, 3534.4 2160.0",

  /**
   * Sampled from the photograph at nine points along the rim, so the drawn line
   * is the same colour as the thing it becomes. Near-black maroon where the limb
   * is barely lit, through red and orange, to the near-white hot section.
   */
  stops: [
    { offset: "0%", color: "#3e090d" },
    { offset: "13%", color: "#91161b" },
    { offset: "25%", color: "#ef4437" },
    { offset: "38%", color: "#ffdf7c" },
    { offset: "50%", color: "#fffab6" },
    { offset: "63%", color: "#fdfcc6" },
    { offset: "75%", color: "#fef9bc" },
    { offset: "88%", color: "#f8ffa3" },
    { offset: "100%", color: "#ffe18b" },
  ] as readonly GradientStop[],
} as const;
