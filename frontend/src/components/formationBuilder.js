// components/FormationBuilder.jsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FORMATIONS } from "@/lib/formations";
import PitchLines from "@/components/Pitchlines";
import PlayerSlot from "@/components/playerSlot";
import PlayerPicker from "@/components/player";
import LineupStatsPanel from "@/components/lineup/LineupStatsPanel";
import { lineupService } from "@/lib/lineupService";
import { useAuth } from "@/context/auth_context";
import { useTeam } from "@/context/team_context";
import { IoPencil } from "react-icons/io5";

const fieldClass =
  "min-h-11 rounded-md border border-border bg-overlay px-2.5 py-1 text-sm text-foreground placeholder-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40";

export default function FormationBuilder({ lineupId: lineupIdProp }) {
  const { user } = useAuth();
  const { teams } = useTeam();
  const searchParams = useSearchParams();
  const [formationId, setFormationId] = useState("4-3-3");
  const [lineupName, setLineupName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [lineupId, setLineupId] = useState(null);
  const [lineup, setLineup] = useState({});
  const [activeSlotId, setActiveSlotId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const formation = FORMATIONS[formationId];

  const usedPlayerIds = useMemo(
    () => new Set(Object.values(lineup).map((p) => p.id)),
    [lineup],
  );

  useEffect(() => {
    const id = lineupIdProp || searchParams.get("id");
    if (!id || !user) return;
    let active = true;
    lineupService
      .getLineup(user, id)
      .then((saved) => {
        if (!active || !saved) return;
        setLineupId(saved.id);
        setLineupName(saved.name);
        setTeamId(saved.teamId || "");
        if (FORMATIONS[saved.formation]) setFormationId(saved.formation);
        setLineup(saved.players);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [searchParams, user, lineupIdProp]);

  function handleSelect(slotId) {
    setActiveSlotId(slotId);
  }

  function handlePick(player) {
    if (!activeSlotId) return;
    setLineup((prev) => ({ ...prev, [activeSlotId]: player }));
    setActiveSlotId(null);
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setNotice(null);
    try {
      const id = await lineupService.saveLineup(user, {
        id: lineupId,
        name: lineupName,
        formation: formationId,
        teamId: teamId || null,
        players: lineup,
      });
      setLineupId(id);
      setNotice({ type: "ok", text: "Lineup saved" });
    } catch (err) {
      setNotice({ type: "err", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-end">
        <div className="flex flex-col gap-1">
          <div className="relative w-fit">
            <input
              id="lineup-name"
              type="text"
              name="lineupName"
              placeholder="Lineup Name"
              className={fieldClass}
              value={lineupName}
              onChange={(e) => setLineupName(e.target.value)}
              maxLength={40}
            />
            <IoPencil
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
              size={18}
            />
          </div>
        </div>
        <select
          value={formationId}
          onChange={(e) => {
            setFormationId(e.target.value);
            setLineup({}); // reset when formation shape changes
          }}
          className={fieldClass}
        >
          {Object.entries(FORMATIONS).map(([key, f]) => (
            <option key={key} value={key}>
              {f.name}
            </option>
          ))}
        </select>
        <select
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          className={fieldClass}
        >
          <option value="">No team</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div
        className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-lg"
        style={{
          background:
            "linear-gradient(160deg, #0d6b3c 0%, #14934f 55%, #0d6b3c 100%)",
        }}
      >
        <PitchLines />
        {formation.slots.map((slot) => (
          <PlayerSlot
            key={slot.id}
            slot={slot}
            player={lineup[slot.id]}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <div className="mt-4">
        <LineupStatsPanel players={lineup} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {notice ? (
          <p
            className={
              notice.type === "ok" ? "text-sm text-accent" : "text-sm text-red-400"
            }
          >
            {notice.text}
          </p>
        ) : (
          <span className="text-xs text-text-muted">
            {lineupId ? "Editing saved lineup" : "New lineup"}
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving || !user}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save lineup"}
        </button>
      </div>

      <PlayerPicker
        key={activeSlotId ?? "closed"}
        open={activeSlotId !== null}
        usedPlayerIds={usedPlayerIds}
        onPick={handlePick}
        onClose={() => setActiveSlotId(null)}
      />
    </div>
  );
}
