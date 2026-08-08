"use client";

function ReachRow({ label, value, hint }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border py-3 last:border-0">
      <div>
        <p className="text-sm text-foreground">{label}</p>
        {hint && <p className="mt-0.5 text-[11px] text-text-muted">{hint}</p>}
      </div>
      <span className="font-mono text-xl text-foreground">{value}</span>
    </div>
  );
}

export default function SharingReach({ sharing }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">Sharing reach</h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-muted">
          shared plans
        </span>
      </div>
      <div className="mt-4">
        <ReachRow
          label="Links created"
          value={sharing.total}
          hint="share codes issued"
        />
        <ReachRow
          label="Active links"
          value={sharing.active}
          hint="still live right now"
        />
        <ReachRow
          label="Total views"
          value={sharing.totalViews}
          hint="every open, including yours"
        />
        <ReachRow
          label="Avg views per link"
          value={sharing.averageViews}
          hint="how far a link travels"
        />
      </div>
    </div>
  );
}
