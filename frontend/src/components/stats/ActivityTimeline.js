"use client";

export default function ActivityTimeline({ timeline }) {
  const max = Math.max(1, ...timeline.map((d) => d.created));
  const total = timeline.reduce((s, d) => s + d.created, 0);
  const todayLabel = timeline[timeline.length - 1]?.day;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">Last 14 days</h3>
        <span className="font-mono text-[11px] text-text-secondary">
          {total} created
        </span>
      </div>

      <div className="mt-6 flex h-32 items-end gap-1.5">
        {timeline.map((d, i) => {
          const height = d.created ? Math.max(8, (d.created / max) * 100) : 2;
          const isToday = d.day === todayLabel;
          return (
            <div
              key={`${d.day}-${i}`}
              className="group relative flex h-full flex-1 flex-col items-center justify-end"
            >
              <span className="mb-1 hidden font-mono text-[10px] text-text-muted group-hover:block">
                {d.created}
              </span>
              <div
                className={`w-full rounded-t ${
                  isToday
                    ? "bg-accent-warm"
                    : d.created
                      ? "bg-accent"
                      : "bg-overlay"
                }`}
                style={{ height: `${height}%` }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
        {timeline
          .filter((_, i) => i % 2 === 0)
          .map((d) => (
            <span
              key={d.day}
              className="font-mono text-[10px] text-text-muted"
            >
              {d.day}
            </span>
          ))}
      </div>
    </div>
  );
}
