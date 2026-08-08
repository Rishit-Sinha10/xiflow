"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  LayoutGrid,
  ArrowRight,
  Trash2,
  Pencil,
  Users,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/shared/Button";
import Empty from "@/components/shared/Empty";
import Badge from "@/components/shared/Badge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useAuth } from "@/context/auth_context";
import { useLineup } from "@/context/lineup_context";
import { statsService } from "@/lib/statsService";

function SnapshotStat({ label, value }) {
  return (
    <div>
      <div className="font-mono text-2xl leading-none text-foreground">{value}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-text-muted">
        {label}
      </div>
    </div>
  );
}

function Card({ title, desc, icon: Icon, action }) {
  return (
    <div className="flex flex-col items-start justify-between rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:border-border-hover">
      <div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-overlay">
          <Icon className="h-[18px] w-[18px] text-foreground" strokeWidth={1.5} />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-[15px] leading-[1.65] text-text-secondary">{desc}</p>
      </div>
      {action && <div className="mt-6 flex w-full items-center gap-2">{action}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { lineups, loading: lineupsLoading, deleteLineup } = useLineup();
  const [overview, setOverview] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (!user) return;
    let active = true;
    statsService
      .getOverview(user)
      .then((s) => active && setOverview(s))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [user]);

  async function handleDelete() {
    if (!confirmDelete) return;
    try {
      await deleteLineup(confirmDelete);
    } catch {}
    finally {
      setConfirmDelete(null);
    }
  }

  const firstName = (user?.displayName || user?.email || "").split(" ")[0];

  return (
    <AppShell eyebrow="Command center" title={`Welcome back, ${firstName}`}>
      {overview && (
        <Link
          href="/stats"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-border-hover"
        >
          <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-x-6 gap-y-4">
            <SnapshotStat label="Lineups" value={overview.lineups.total} />
            <SnapshotStat label="Teams" value={overview.teams.total} />
            <SnapshotStat label="Links" value={overview.sharing.total} />
            <SnapshotStat label="Views" value={overview.sharing.totalViews} />
          </div>
          <span className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-text-muted transition-colors group-hover:text-accent sm:inline-flex">
            Full match reports
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      )}

      <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
        <Card
          title="New lineup"
          desc="Open the builder and set up your next match plan."
          icon={Plus}
          action={
            <Link href="/builder" className="inline-block">
              <Button className="w-full">
                Open builder
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          }
        />
        <Card
          title="Saved lineups"
          desc={`${lineupsLoading ? "Loading..." : `${lineups.length} saved`}. Reopen any lineup and keep editing.`}
          icon={LayoutGrid}
          action={
            <Link href="/lineups">
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          }
        />
        <Card
          title="Teams"
          desc="Manage your squads and attach lineups to a real team."
          icon={Users}
          action={
            <Link href="/teams">
              <Button variant="ghost" size="sm">
                Manage teams
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          }
        />
      </div>

      {lineups.length > 0 ? (
        <div className="mt-14">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight">Your lineups</h2>
            <Badge variant="muted" className="px-2.5 py-0.5 font-mono text-[10px]">
              {lineups.length}
            </Badge>
          </div>
          <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
            {lineups.map((l) => (
              <article
                key={l.id}
                className="group rounded-2xl border border-border bg-surface p-5 transition-all duration-300 hover:border-border-hover"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{l.name}</h3>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                      {l.formation}
                    </p>
                  </div>
                  <Badge variant="muted">{Object.keys(l.players).length}/11</Badge>
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <Link
                    href={`/builder?id=${l.id}`}
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-overlay px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-overlay-hover"
                  >
                    <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Edit
                  </Link>
                  <button
                    onClick={() => setConfirmDelete(l.id)}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border p-2 text-text-muted transition-colors hover:border-red-500/40 hover:text-red-400"
                    aria-label={`Delete ${l.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        !lineupsLoading && (
          <div className="mt-14">
            <Empty
              icon={LayoutGrid}
              title="No lineups yet"
              description="Build your first lineup and it will show up here for quick access."
              action={
                <Link href="/builder">
                  <Button>
                    <Plus className="h-4 w-4" />
                    Open builder
                  </Button>
                </Link>
              }
            />
          </div>
        )
      )}

      <ConfirmDialog
        open={confirmDelete !== null}
        title="Delete lineup?"
        message="This permanently removes the lineup and cannot be undone."
        confirmLabel="Delete lineup"
        onConfirm={handleDelete}
        onClose={() => setConfirmDelete(null)}
      />
    </AppShell>
  );
}
