"use client";

import { useMemo } from "react";

function categorize(position, role) {
  const p = String(position || "").toUpperCase();
  const r = String(role || "").toUpperCase();
  if (r === "G" || p.includes("GK") || p.includes("GOALKEEPER")) return "GK";
  if (r === "D" || p.includes("DEF") || p.includes("BACK") || p.includes("CB"))
    return "DEF";
  if (r === "M" || p.includes("MID") || p.includes("DM") || p.includes("AM") || p.includes("W"))
    return "MID";
  if (r === "F" || p.includes("FWD") || p.includes("FORWARD") || p.includes("ST") || p.includes("CF"))
    return "FWD";
  return "OTHER";
}

const POSITION_LABELS = {
  GK: "Goalkeepers",
  DEF: "Defenders",
  MID: "Midfielders",
  FWD: "Forwards",
  OTHER: "Other",
};

const RATING_BUCKETS = [
  { label: "<70", min: 0, max: 69 },
  { label: "70–74", min: 70, max: 74 },
  { label: "75–79", min: 75, max: 79 },
  { label: "80–84", min: 80, max: 84 },
  { label: "85+", min: 85, max: 999 },
];

function strengthOf(rating) {
  if (!rating) return "Rebuilding";
  if (rating >= 85) return "Elite";
  if (rating >= 80) return "Strong";
  if (rating >= 75) return "Solid";
  if (rating >= 70) return "Developing";
  return "Rebuilding";
}

function Bar({ label, count, total, colorClass }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="uppercase tracking-wide text-text-muted">{label}</span>
        <span className="font-mono text-foreground">
          {count}
          <span className="text-text-muted"> · {pct}%</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-overlay">
        <div
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StatChip({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3.5 text-center">
      <div className="text-lg font-semibold leading-tight text-foreground">
        {value}
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
        {label}
      </div>
    </div>
  );
}

export default function LineupStatsPanel({ players }) {
  const list = useMemo(
    () => Object.values(players || {}).filter((p) => p && p.name),
    [players],
  );
  const total = list.length;

  const data = useMemo(() => {
    const rated = list.filter((p) => typeof p.rating === "number");
    const aged = list.filter((p) => typeof p.age === "number");
    const avgRating = rated.length
      ? Math.round((rated.reduce((s, p) => s + p.rating, 0) / rated.length) * 10) /
        10
      : 0;
    const avgAge = aged.length
      ? Math.round((aged.reduce((s, p) => s + p.age, 0) / aged.length) * 10) /
        10
      : null;

    const distribution = {};
    for (const p of list) {
      const key = categorize(p.position, p.role);
      distribution[key] = (distribution[key] || 0) + 1;
    }

    const histogram = RATING_BUCKETS.map((b) => ({
      ...b,
      count: rated.filter((p) => p.rating >= b.min && p.rating <= b.max).length,
    }));

    const effectiveness = Math.min(
      100,
      Math.round(avgRating * (total / 11)),
    );

    return { avgRating, avgAge, distribution, histogram, effectiveness };
  }, [list, total]);

  if (total === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-background px-4 py-6 text-center text-sm text-text-muted">
        Add players to see lineup statistics.
      </div>
    );
  }

  const positionOrder = ["GK", "DEF", "MID", "FWD", "OTHER"].filter(
    (k) => data.distribution[k],
  );
  const maxHistogram = Math.max(1, ...data.histogram.map((h) => h.count));

  return (
    <section className="space-y-5 rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Lineup stats</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
            data.avgRating >= 80
              ? "bg-emerald-500/15 text-emerald-400"
              : data.avgRating >= 70
                ? "bg-amber-500/15 text-amber-400"
                : "bg-red-500/15 text-red-400"
          }`}
        >
          {strengthOf(data.avgRating)}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatChip label="Avg rating" value={data.avgRating || "—"} />
        <StatChip label="Avg age" value={data.avgAge ?? "—"} />
        <StatChip label="Filled" value={`${total}/11`} />
      </div>

      <div className="space-y-3">
        {positionOrder.map((key) => (
          <Bar
            key={key}
            label={POSITION_LABELS[key]}
            count={data.distribution[key]}
            total={total}
            colorClass="bg-accent"
          />
        ))}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wide text-text-muted">
            Rating spread
          </span>
          <span className="font-mono text-[10px] text-text-muted">
            {data.effectiveness}/100
          </span>
        </div>
        <div className="flex items-end gap-1.5">
          {data.histogram.map((h) => (
            <div key={h.label} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-accent/60"
                style={{ height: `${Math.max(3, (h.count / maxHistogram) * 36)}px` }}
              />
              <span className="text-[10px] text-text-muted">{h.label}</span>
              <span className="font-mono text-[10px] text-foreground">
                {h.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
