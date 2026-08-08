"use client";

import AppShell from "@/components/layout/AppShell";
import FormationBuilder from "@/components/formationBuilder";

export default function BuilderPage() {
  return (
    <AppShell
      eyebrow="Tactical canvas"
      title="Build your lineup"
      description="Pick a formation, then tap any position to assign a player."
    >
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-10">
        <FormationBuilder />
      </div>
    </AppShell>
  );
}
