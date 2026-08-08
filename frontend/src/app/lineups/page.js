"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, LayoutGrid, Copy, Share2 } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/shared/Button";
import Empty from "@/components/shared/Empty";
import Modal from "@/components/shared/Modal";
import Badge from "@/components/shared/Badge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { SkeletonCard } from "@/components/shared/Skeleton";
import ShareLineupForm from "@/components/lineup/ShareLineupForm";
import { useLineup } from "@/context/lineup_context";
import { useToast } from "@/components/shared/Toast";

export default function LineupsPage() {
  const { lineups, loading, deleteLineup, duplicateLineup } = useLineup();
  const { push } = useToast();
  const [shareId, setShareId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  async function handleDelete() {
    if (!confirmDelete) return;
    try {
      await deleteLineup(confirmDelete);
      push("Lineup deleted");
    } catch {
      push("Could not delete lineup", "err");
    } finally {
      setConfirmDelete(null);
    }
  }

  async function handleDuplicate(id) {
    try {
      await duplicateLineup(id);
      push("Lineup duplicated");
    } catch {
      push("Could not duplicate lineup", "err");
    }
  }

  return (
    <AppShell
      eyebrow="Your library"
      title="Lineups"
      description="Every tactical setup you have built, in one place."
      actions={
        <Link href="/builder">
          <Button>
            <Plus className="h-4 w-4" />
            New lineup
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
      ) : lineups.length === 0 ? (
        <Empty
          icon={LayoutGrid}
          title="No lineups yet"
          description="Build your first tactical setup and it will show up here."
          action={
            <Link href="/builder">
              <Button>
                <Plus className="h-4 w-4" />
                Open builder
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
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
              {l.stats && (
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="accent" className="font-mono text-[11px]">
                    {l.stats.formationStrength || "—"} · {l.stats.totalRating || 0}
                  </Badge>
                  <Badge variant="muted" className="text-[11px]">
                    Avg {l.stats.averageAge ? `${l.stats.averageAge} yrs` : "—"}
                  </Badge>
                </div>
              )}
              <div className="mt-5 flex items-center gap-2">
                <Link
                  href={`/builder?id=${l.id}`}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-overlay px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-overlay-hover"
                >
                  <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Edit
                </Link>
                <button
                  onClick={() => setShareId(l.id)}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border p-2 text-text-muted transition-colors hover:border-accent/50 hover:text-accent"
                  aria-label={`Share ${l.name}`}
                  title="Share"
                >
                  <Share2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
                <button
                  onClick={() => handleDuplicate(l.id)}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border p-2 text-text-muted transition-colors hover:border-border-hover hover:text-foreground"
                  aria-label={`Duplicate ${l.name}`}
                  title="Duplicate"
                >
                  <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
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
      )}

      <Modal
        open={shareId !== null}
        onClose={() => setShareId(null)}
        title="Share lineup"
      >
        {shareId && (
          <ShareLineupForm lineupId={shareId} onDone={() => setShareId(null)} />
        )}
      </Modal>

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
