"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/shared/Button";
import Empty from "@/components/shared/Empty";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { SkeletonCard } from "@/components/shared/Skeleton";
import TeamBadge from "@/components/team/TeamBadge";
import { useTeam } from "@/context/team_context";
import { useToast } from "@/components/shared/Toast";

export default function TeamsPage() {
  const { teams, loading, deleteTeam } = useTeam();
  const { push } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(null);

  async function handleDelete() {
    if (!confirmDelete) return;
    try {
      await deleteTeam(confirmDelete);
      push("Team deleted");
    } catch {
      push("Could not delete team", "err");
    } finally {
      setConfirmDelete(null);
    }
  }

  return (
    <AppShell
      eyebrow="Your clubs"
      title="Teams"
      description="Manage the squads you coach and build lineups around them."
      actions={
        <Link href="/teams/create">
          <Button>
            <Plus className="h-4 w-4" />
            New team
          </Button>
        </Link>
      }
    >
      {loading ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : teams.length === 0 ? (
        <Empty
          icon={Users}
          title="No teams yet"
          description="Create your first team to start building lineups around a real squad."
          action={
            <Link href="/teams/create">
              <Button>
                <Plus className="h-4 w-4" />
                Create team
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          {teams.map((t) => (
            <article
              key={t.id}
              className="group rounded-2xl border border-border bg-surface p-5 transition-all duration-300 hover:border-border-hover"
            >
              <div className="flex items-center gap-4">
                <TeamBadge team={t} size={48} />
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-foreground">{t.name}</h3>
                  <p className="mt-0.5 truncate font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                    {[t.league, t.country].filter(Boolean).join(" · ") || "Unassigned"}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2">
                <Link
                  href={`/teams/${t.id}`}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-overlay px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-overlay-hover"
                >
                  View
                </Link>
                <button
                  onClick={() => setConfirmDelete(t.id)}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border p-2 text-text-muted transition-colors hover:border-red-500/40 hover:text-red-400"
                  aria-label={`Delete ${t.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete !== null}
        title="Delete team?"
        message="This permanently removes the team and cannot be undone."
        confirmLabel="Delete team"
        onConfirm={handleDelete}
        onClose={() => setConfirmDelete(null)}
      />
    </AppShell>
  );
}
