"use client";

import { useMemo } from "react";
import { FORMATIONS } from "@/lib/formations";

function MiniPitch({ formationId }) {
  const formation = FORMATIONS[formationId] || FORMATIONS["4-3-3"];
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-14 w-12 shrink-0"
      role="img"
      aria-label={`${formationId} formation`}
    >
      <rect
        x="2"
        y="2"
        width="96"
        height="96"
        rx="4"
        fill="rgba(5,150,105,0.08)"
        stroke="rgba(5,150,105,0.35)"
        strokeWidth="1.5"
      />
      <line
        x1="2"
        y1="50"
        x2="98"
        y2="50"
        stroke="rgba(5,150,105,0.25)"
        strokeWidth="1"
      />
      {formation.slots.map((slot) => (
        <circle
          key={slot.id}
          cx={slot.left}
          cy={slot.top}
          r="4"
          fill="#34d399"
          opacity="0.9"
        />
      ))}
    </svg>
  );
}

function UsageBar({ count, max }) {
  const pct = max ? Math.round((count / max) * 100) : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-overlay">
      <div
        className="h-full rounded-full bg-accent"
        style={{ width: `${Math.max(3, pct)}%` }}
      />
    </div>
  );
}

export default function FormationUsage({ usage, totalLineups }) {
  const max = useMemo(
    () => Math.max(1, ...usage.map((f) => f.count)),
    [usage],
  );

  if (!usage.length) {
    return (
      <p className="py-8 text-center text-sm text-text-muted">
        No formations yet — save your first lineup.
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">Formation bench</h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-muted">
          most-used first
        </span>
      </div>

      <div className="mt-5 space-y-5">
        {usage.map((f, i) => {
          const isTop = i === 0;
          const share = totalLineups
            ? Math.round((f.count / totalLineups) * 100)
            : 0;
          return (
            <div
              key={f.id}
              className={`flex items-center gap-4 rounded-xl border p-3 transition-colors ${
                isTop
                  ? "border-accent/25 bg-accent/[0.06]"
                  : "border-transparent bg-transparent hover:bg-overlay"
              }`}
            >
              <MiniPitch formationId={f.id} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-sm font-semibold tracking-wide text-foreground">
                    {f.id}
                  </span>
                  <span className="font-mono text-sm text-foreground">
                    {f.count}
                    <span className="text-text-muted"> / {totalLineups}</span>
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1">
                    <UsageBar count={f.count} max={max} />
                  </div>
                  <span className="w-8 text-right font-mono text-[10px] text-text-muted">
                    {share}%
                  </span>
                </div>
                {isTop && (
                  <p className="mt-1.5 text-[11px] text-accent">
                    Your go-to shape
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
