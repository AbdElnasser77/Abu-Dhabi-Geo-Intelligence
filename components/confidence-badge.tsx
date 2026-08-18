import { STATUS_COLORS } from "@/lib/colors";
import { bi } from "@/lib/i18n";
import { DATA_STATUS_LABELS, DATA_STATUS_MEANING, type DataStatus, type Lang } from "@/lib/taxonomy";

/**
 * The status label that `reference/00` requires beside every displayed measure.
 *
 * The explanation is rendered as screen-reader text as well as a `title`, because
 * `reference/01` asks for "a tooltip explaining confidence" and a title
 * attribute alone is invisible to keyboard and screen-reader users.
 */
export function ConfidenceBadge({
  status,
  lang,
  size = "md",
}: {
  status: DataStatus;
  lang: Lang;
  size?: "sm" | "md";
}) {
  const meaning = bi(DATA_STATUS_MEANING[status], lang);
  return (
    <span
      className={
        size === "sm"
          ? "inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-2 py-0.5 text-[11px] font-medium text-ink-muted"
          : "inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-2.5 py-1 text-xs font-medium text-ink-muted"
      }
      title={meaning}
    >
      <span
        aria-hidden="true"
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: STATUS_COLORS[status] }}
      />
      {bi(DATA_STATUS_LABELS[status], lang)}
      <span className="sr-only">. {meaning}</span>
    </span>
  );
}
