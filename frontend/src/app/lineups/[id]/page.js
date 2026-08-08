"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import FormationBuilder from "@/components/formationBuilder";
import Button from "@/components/shared/Button";

export default function LineupDetailPage() {
  const params = useParams();
  const router = useRouter();

  return (
    <AppShell
      eyebrow="Tactical canvas"
      title="Edit lineup"
      description="Fine-tune your setup and save your changes."
      actions={
        <Button variant="ghost" onClick={() => router.push("/lineups")}>
          <ArrowLeft className="h-4 w-4" />
          Back to lineups
        </Button>
      }
    >
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-10">
        <FormationBuilder lineupId={params.id} />
      </div>
    </AppShell>
  );
}
