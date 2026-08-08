"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Users,
  CalendarDays,
  UserPlus,
  X,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import Empty from "@/components/shared/Empty";
import Modal from "@/components/shared/Modal";
import Field, { inputClass } from "@/components/shared/Field";
import Badge from "@/components/shared/Badge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import TeamBadge from "@/components/team/TeamBadge";
import ColorPicker from "@/components/team/ColorPicker";
import { useTeam } from "@/context/team_context";
import { useLineup } from "@/context/lineup_context";
import { useAuth } from "@/context/auth_context";
import { useToast } from "@/components/shared/Toast";

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <Icon className="h-4 w-4 text-accent" strokeWidth={1.75} />
      <div className="mt-3 text-lg font-semibold text-foreground">{value}</div>
      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-text-muted">
        {label}
      </div>
    </div>
  );
}

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { teams, loading, saveTeam, deleteTeam, addMember, removeMember } =
    useTeam();
  const { lineups } = useLineup();
  const { push } = useToast();

  const team = teams.find((t) => t.id === params.id);

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [memberUid, setMemberUid] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(null);

  function openEdit() {
    if (!team) return;
    setForm({ ...team });
    setEditOpen(true);
  }

  if (loading) return <AppShell><Loading label="Loading team" /></AppShell>;

  if (!team) {
    return (
      <AppShell eyebrow="Teams" title="Team not found">
        <Empty
          icon={Users}
          title="We could not find that team"
          description="It may have been deleted, or the link is invalid."
          action={
            <Button variant="ghost" onClick={() => router.push("/teams")}>
              <ArrowLeft className="h-4 w-4" />
              Back to teams
            </Button>
          }
        />
      </AppShell>
    );
  }

  const teamLineups = lineups.filter((l) => l.teamId === team.id);

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim() || busy) return;
    setBusy(true);
    try {
      await saveTeam({
        ...form,
        id: team.id,
        founded: form.founded ? Number(form.founded) : null,
      });
      push("Team updated");
      setEditOpen(false);
    } catch {
      push("Could not update team", "err");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteTeam(team.id);
      push("Team deleted");
      router.push("/teams");
    } catch {
      push("Could not delete team", "err");
    } finally {
      setConfirmDelete(false);
    }
  }

  async function handleAddMember(e) {
    e.preventDefault();
    const uid = memberUid.trim();
    if (!uid || addingMember) return;
    setAddingMember(true);
    try {
      await addMember(team.id, uid);
      setMemberUid("");
      push("Member added");
    } catch (err) {
      push(err.message || "Could not add member", "err");
    } finally {
      setAddingMember(false);
    }
  }

  async function handleRemoveMember(uid) {
    try {
      await removeMember(team.id, uid);
      push("Member removed");
    } catch (err) {
      push(err.message || "Could not remove member", "err");
    } finally {
      setConfirmRemove(null);
    }
  }

  const members = team.members || [];

  return (
    <AppShell
      eyebrow={[team.league, team.country].filter(Boolean).join(" · ") || "Team"}
      title={team.name}
      description={team.founded ? `Founded ${team.founded}` : "No founding year set"}
      actions={
        <>
          <Button variant="ghost" onClick={openEdit}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </>
      }
    >
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex items-center gap-5">
          <TeamBadge team={team} size={72} />
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {team.name}
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              {[team.league, team.country].filter(Boolean).join(" · ") || "No league assigned"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Stat icon={Users} label="Members" value={members.length} />
          <Stat icon={CalendarDays} label="Founded" value={team.founded || "—"} />
          <Stat icon={Users} label="Lineups" value={teamLineups.length} />
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-foreground">Members</h3>
            <Badge variant="muted" className="px-2.5 py-0.5 font-mono text-[10px]">
              {members.length}
            </Badge>
          </div>
          <form
            onSubmit={handleAddMember}
            className="mt-3 flex items-center gap-2"
          >
            <input
              value={memberUid}
              onChange={(e) => setMemberUid(e.target.value)}
              placeholder="User UID to add"
              className={inputClass}
            />
            <Button
              type="submit"
              size="sm"
              variant="ghost"
              loading={addingMember}
              disabled={!memberUid.trim()}
            >
              <UserPlus className="h-4 w-4" />
              Add
            </Button>
          </form>
          {members.length === 0 ? (
            <p className="mt-3 text-sm leading-[1.65] text-text-muted">
              No members yet. Add a user UID above to invite a collaborator.
            </p>
          ) : (
            <ul className="mt-3 flex flex-wrap gap-2">
              {members.map((m) => (
                <li
                  key={m}
                  className="flex items-center gap-2 rounded-full border border-border bg-overlay px-3 py-1.5 text-sm text-foreground"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-[10px] font-bold text-accent">
                    {m.slice(0, 2).toUpperCase()}
                  </span>
                  {m}
                  {m === user?.uid && (
                    <Badge variant="accent" className="px-2 py-0.5 text-[10px]">
                      you
                    </Badge>
                  )}
                  {m !== user?.uid && (
                    <button
                      onClick={() => setConfirmRemove(m)}
                      className="rounded-full p-1 text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                      aria-label={`Remove ${m}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit team">
        {form && (
          <form onSubmit={handleSave} className="space-y-4">
            <Field
              label="Team name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Short name"
                value={form.shortName}
                onChange={(e) => setForm((p) => ({ ...p, shortName: e.target.value }))}
                maxLength={3}
              />
              <Field
                label="Founded"
                type="number"
                value={form.founded ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, founded: e.target.value }))}
                min={1800}
                max={2030}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="League"
                value={form.league}
                onChange={(e) => setForm((p) => ({ ...p, league: e.target.value }))}
              />
              <Field
                label="Country"
                value={form.country}
                onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
              />
            </div>
            <Field
              label="Badge URL (optional)"
              value={form.badge}
              onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))}
            />
            <ColorPicker
              value={form.color}
              onChange={(c) => setForm((p) => ({ ...p, color: c }))}
              ringOffset="ring-offset-background"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={busy} disabled={!form.name.trim()}>
                Save changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete ${team.name}?`}
        message="This permanently removes the team and cannot be undone."
        confirmLabel="Delete team"
        onConfirm={handleDelete}
        onClose={() => setConfirmDelete(false)}
      />

      <ConfirmDialog
        open={confirmRemove !== null}
        title="Remove member?"
        message="They will lose access to this team and its lineups."
        confirmLabel="Remove"
        onConfirm={() => handleRemoveMember(confirmRemove)}
        onClose={() => setConfirmRemove(null)}
      />
    </AppShell>
  );
}
