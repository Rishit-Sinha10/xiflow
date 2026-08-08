"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Eye, Share2 } from "lucide-react";
import Loading from "@/components/shared/Loading";
import Empty from "@/components/shared/Empty";
import Button from "@/components/shared/Button";
import Badge from "@/components/shared/Badge";
import ReadOnlyPitch from "@/components/lineup/ReadOnlyPitch";
import LineupStatsPanel from "@/components/lineup/LineupStatsPanel";
import TeamBadge from "@/components/team/TeamBadge";
import { sharingService } from "@/lib/sharingService";

export default function SharedLineupPage() {
  const params = useParams();
  const accessCode = String(params.accessCode || "");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    sharingService
      .getShared(accessCode)
      .then((result) => {
        if (!active) return;
        setData(result);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Share link not found");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [accessCode]);

  return (
    <main className="min-h-screen bg-background font-sans antialiased text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-foreground"
          >
            Tactic<span className="text-accent">Forge</span>
          </Link>
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
            <Share2 className="h-3.5 w-3.5" />
            Shared lineup
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        {loading ? (
          <Loading label="Loading shared lineup" />
        ) : error || !data ? (
          <Empty
            icon={Share2}
            title="Lineup unavailable"
            description={error || "This share link could not be loaded."}
            action={
              <Link href="/" className="inline-block">
                <Button>Go to xiflow</Button>
              </Link>
            }
          />
        ) : (
          <>
            <div className="mb-8 flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                Shared lineup
              </span>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
                    {data.lineup.name}
                  </h1>
                  <p className="mt-1 max-w-md text-[15px] leading-[1.7] text-text-secondary">
                    {data.lineup.formation} formation · viewed{" "}
                    {data.share.views}{" "}
                    {data.share.views === 1 ? "time" : "times"}
                  </p>
                </div>
                <Badge variant="neutral">
                  <Eye className="h-3.5 w-3.5" />
                  {data.share.views} views
                </Badge>
              </div>
            </div>

            {data.team && (
              <div className="mb-6 inline-flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
                <TeamBadge team={data.team} size={44} />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {data.team.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {[data.team.league, data.team.country]
                      .filter(Boolean)
                      .join(" · ") || "Team"}
                  </p>
                </div>
              </div>
            )}

            <div className="mx-auto max-w-md rounded-3xl border border-border bg-surface p-6">
              <ReadOnlyPitch
                formationId={data.lineup.formation}
                players={data.lineup.players || {}}
                teamColor={data.team?.color}
              />
            </div>

            <div className="mx-auto mt-6 max-w-md">
              <LineupStatsPanel players={data.lineup.players || {}} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
