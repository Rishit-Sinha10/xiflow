"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Empty from "@/components/shared/Empty";
import Button from "@/components/shared/Button";
import Skeleton from "@/components/shared/Skeleton";
import FormationUsage from "@/components/stats/FormationUsage";
import TopPlayers from "@/components/stats/TopPlayers";
import ActivityTimeline from "@/components/stats/ActivityTimeline";
import SharingReach from "@/components/stats/SharingReach";
import { useAuth } from "@/context/auth_context";
import { statsService } from "@/lib/statsService";

function StatCard({ label, value, hint, tone = "default" }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
        {label}
      </p>
      <div
        className={`mt-3 font-mono text-4xl leading-none tracking-tight sm:text-5xl ${
          tone === "warm" ? "text-accent-warm" : "text-foreground"
        }`}
      >
        {value}
      </div>
      <p className="mt-3 border-t border-border pt-3 text-xs text-text-secondary">
        {hint}
      </p>
    </div>
  );
}

export default function StatsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    let active = true;
    statsService
      .getOverview(user)
      .then((s) => {
        if (!active) return;
        setStats(s);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Could not load stats");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [user]);

  if (loading || !user) {
    return (
      <AppShell eyebrow="Match reports" title="This season on the board">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-6">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="mt-3 h-10 w-16" />
              <Skeleton className="mt-3 h-3 w-full" />
            </div>
          ))}
        </div>
      </AppShell>
    );
  }

  if (error || !stats) {
    return (
      <AppShell eyebrow="Match reports" title="This season on the board">
        <Empty
          icon={BarChart3}
          title="Stats unavailable"
          description={error || "We could not load your stats right now."}
        />
      </AppShell>
    );
  }

  const empty =
    stats.lineups.total === 0 && stats.teams.total === 0 && stats.sharing.total === 0;

  if (empty) {
    return (
      <AppShell
        eyebrow="Match reports"
        title="This season on the board"
        description="Draw up your first lineup and this page becomes your season ledger — formations, players, and reach."
      >
        <Empty
          icon={BarChart3}
          title="Nothing on the board yet"
          description="Save a lineup or a team and your numbers will show up here."
          action={
            <Link href="/builder" className="inline-block">
              <Button>
                Open builder
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          }
        />
      </AppShell>
    );
  }

  return (
    <AppShell
      eyebrow="Match reports"
      title="This season on the board"
      description="The shapes you lean on, the players you trust, and how far your plans travel."
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
        <StatCard
          label="Lineups drawn"
          value={stats.lineups.total}
          hint={`${stats.lineups.withTeam} attached to a team`}
        />
        <StatCard
          label="Teams managed"
          value={stats.teams.total}
          hint={`${stats.teams.members} members across squads`}
        />
        <StatCard
          label="Links created"
          value={stats.sharing.total}
          hint={`${stats.sharing.active} still live`}
        />
        <StatCard
          label="Views earned"
          value={stats.sharing.totalViews}
          hint={`${stats.sharing.averageViews} per link on average`}
          tone="warm"
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FormationUsage
            usage={stats.formations.usage}
            totalLineups={stats.lineups.total}
          />
        </div>
        <TopPlayers players={stats.players.top} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityTimeline timeline={stats.timeline} />
        </div>
        <SharingReach sharing={stats.sharing} />
      </div>
    </AppShell>
  );
}
