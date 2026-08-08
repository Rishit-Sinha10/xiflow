"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/shared/Button";
import Field from "@/components/shared/Field";
import TeamBadge from "@/components/team/TeamBadge";
import ColorPicker from "@/components/team/ColorPicker";
import { useTeam } from "@/context/team_context";
import { useToast } from "@/components/shared/Toast";

export default function CreateTeamPage() {
  const router = useRouter();
  const { saveTeam } = useTeam();
  const { push } = useToast();
  const [form, setForm] = useState({
    name: "",
    shortName: "",
    badge: "",
    league: "",
    country: "",
    founded: "",
    color: "#059669",
  });
  const [busy, setBusy] = useState(false);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || busy) return;
    setBusy(true);
    try {
      const id = await saveTeam({
        name: form.name,
        shortName: form.shortName,
        badge: form.badge,
        league: form.league,
        country: form.country,
        founded: form.founded ? Number(form.founded) : null,
        color: form.color,
      });
      push("Team created");
      router.push(`/teams/${id}`);
    } catch {
      push("Could not create team", "err");
    } finally {
      setBusy(false);
    }
  }

  const preview = {
    name: form.name || "Your team",
    shortName: form.shortName,
    badge: form.badge,
    color: form.color,
  };

  return (
    <AppShell
      eyebrow="New club"
      title="Create a team"
      description="Set up a squad to attach lineups and players to."
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-xl rounded-3xl border border-border bg-surface p-6 sm:p-8"
      >
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <TeamBadge team={preview} size={56} />
            <div className="flex-1">
              <Field
                label="Team name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Manchester City"
                autoFocus
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              label="Short name"
              value={form.shortName}
              onChange={(e) => update("shortName", e.target.value)}
              placeholder="e.g. MCI"
              maxLength={3}
            />
            <Field
              label="League"
              value={form.league}
              onChange={(e) => update("league", e.target.value)}
              placeholder="e.g. Premier League"
            />
            <Field
              label="Country"
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              placeholder="e.g. England"
            />
            <Field
              label="Founded"
              type="number"
              value={form.founded}
              onChange={(e) => update("founded", e.target.value)}
              placeholder="e.g. 1894"
              min={1800}
              max={2030}
            />
          </div>

          <Field
            label="Badge URL (optional)"
            value={form.badge}
            onChange={(e) => update("badge", e.target.value)}
            placeholder="https://example.com/badge.png"
          />

          <ColorPicker
            value={form.color}
            onChange={(c) => update("color", c)}
          />
        </div>

        <div className="mt-8 flex items-center gap-3">
          <Button type="submit" loading={busy} disabled={!form.name.trim()}>
            Create team
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push("/teams")}>
            Cancel
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
