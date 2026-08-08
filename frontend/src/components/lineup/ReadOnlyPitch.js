"use client";

import { FORMATIONS } from "@/lib/formations";
import PitchLines from "@/components/Pitchlines";

function initials(name) {
  return (name || "")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ReadOnlyPitch({ formationId, players, teamColor }) {
  const formation = FORMATIONS[formationId] || FORMATIONS["4-3-3"];
  const color = teamColor || "#14934f";
  return (
    <div
      className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-lg"
      style={{
        background: `linear-gradient(160deg, ${color} 0%, ${color}55 55%, ${color} 100%)`,
      }}
    >
      <PitchLines />
      {formation.slots.map((slot) => {
        const player = players[slot.id];
        return (
          <div
            key={slot.id}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ top: `${slot.top}%`, left: `${slot.left}%` }}
          >
            {player ? (
              <>
                <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white/40 bg-black/30 shadow-md backdrop-blur-sm">
                  {player.photoUrl ? (
                    <img
                      src={player.photoUrl}
                      alt={player.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-white">
                      {initials(player.name)}
                    </span>
                  )}
                </span>
                <span className="mt-1 max-w-16 truncate text-[10px] font-medium uppercase tracking-wide text-white/85">
                  {player.name}
                </span>
              </>
            ) : (
              <span className="text-[10px] uppercase tracking-wide text-white/40">
                {slot.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
