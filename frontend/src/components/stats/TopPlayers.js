"use client";

function initials(name) {
  return (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TopPlayers({ players }) {
  if (!players.length) {
    return (
      <p className="py-8 text-center text-sm text-text-muted">
        Pick players in your lineups to see who you rely on.
      </p>
    );
  }

  const max = Math.max(1, ...players.map((p) => p.appearances));

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">Most-used players</h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-muted">
          selected most
        </span>
      </div>

      <ol className="mt-5 space-y-4">
        {players.map((p, i) => {
          const pct = p.lineups ? Math.round((p.appearances / p.lineups) * 100) : 0;
          return (
            <li key={p.id} className="flex items-center gap-3">
              <span className="w-5 font-mono text-[11px] text-text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent/15 text-xs font-bold text-accent">
                {p.photoUrl ? (
                  <img
                    src={p.photoUrl}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials(p.name)
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm text-foreground">{p.name}</p>
                  <span className="font-mono text-[11px] text-text-secondary">
                    {p.appearances}×
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-overlay">
                    <div
                      className="h-full rounded-full bg-accent-light"
                      style={{ width: `${Math.max(3, (p.appearances / max) * 100)}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-text-muted">
                    {pct}% of lineups
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
