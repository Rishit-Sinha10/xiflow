"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { FORMATIONS } from "@/lib/formations";
import PitchLines from "@/components/Pitchlines";
import PlayerSlot from "@/components/playerSlot";
import LineupStatsPanel from "@/components/lineup/LineupStatsPanel";
import { buildDemoLineup } from "./demoData";

const PITCH_GRADIENT =
  "linear-gradient(160deg, #0d6b3c 0%, #14934f 55%, #0d6b3c 100%)";

export default function DemoBuilder({ formationId, showStats = true, onSelect }) {
  const formation = FORMATIONS[formationId] || FORMATIONS["4-3-3"];

  const lineup = useMemo(
    () => buildDemoLineup(formation.slots),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formationId],
  );

  return (
    <div className="w-full">
      <div
        className="relative mx-auto aspect-[3/4] w-full max-w-[340px] overflow-hidden rounded-2xl border border-white/15 shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_12px_40px_-12px_rgba(4,20,10,0.5)]"
        style={{ background: PITCH_GRADIENT }}
      >
        <PitchLines />
        {formation.slots.map((slot, i) => (
          <motion.div
            key={slot.id}
            className="absolute"
            style={{ top: `${slot.top}%`, left: `${slot.left}%` }}
            animate={{ top: `${slot.top}%`, left: `${slot.left}%` }}
            transition={{
              duration: 0.7,
              delay: i * 0.018,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <PlayerSlot
              slot={slot}
              player={lineup[slot.id]}
              onSelect={onSelect || (() => {})}
            />
          </motion.div>
        ))}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
      </div>

      {showStats && (
        <div className="mx-auto mt-4 max-w-[340px]">
          <LineupStatsPanel players={lineup} />
        </div>
      )}
    </div>
  );
}
