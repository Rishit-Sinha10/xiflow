import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PublicShell from "@/components/layout/PublicShell";
import {
  DocHeader,
  DocSection,
  DocH2,
  DocH3,
  DocP,
  DocList,
  DocCallout,
  DocTable,
  DocCode,
  Toc,
} from "@/components/layout/DocLayout";

const TOC = [
  { href: "#getting-started", label: "Getting started" },
  { href: "#building-lineups", label: "Building lineups" },
  { href: "#formations", label: "Formations" },
  { href: "#teams", label: "Teams" },
  { href: "#sharing", label: "Sharing lineups" },
  { href: "#stats", label: "Reading stats" },
  { href: "#shortcuts", label: "Shortcuts" },
];

const SHORTCUTS = [
  ["Ctrl/Cmd + Enter", "Run / preview current lineup"],
  ["Ctrl/Cmd + S", "Save current lineup"],
  ["Ctrl/Cmd + Z", "Undo last action"],
  ["Shift + Ctrl/Cmd + Z", "Redo last action"],
  ["Ctrl/Cmd + F", "Search players"],
  ["Esc", "Deselect / close panel"],
];

export const metadata = {
  title: "Documentation — xiflow",
  description:
    "Learn how to build tactical lineups, manage teams, share plans, and read stats in xiflow.",
};

export default function DocumentationPage() {
  return (
    <PublicShell>
      <DocHeader
        eyebrow="Documentation"
        title="How xiflow works"
        description="A product guide to building lineups, managing teams, sharing your plans, and reading the numbers."
        updated="July 3, 2026"
      />

      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
        <div className="flex gap-12">
          <Toc items={TOC} />

          <div className="min-w-0 flex-1 max-w-3xl">
            <DocSection id="getting-started">
              <DocH2 id="getting-started">Getting started</DocH2>
              <DocP>
                Create an account, then open the{" "}
                <Link href="/builder" className="rounded-sm text-accent-light transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
                  builder
                </Link>{" "}
                to draw your first lineup. You'll be dropped onto a pitch with a
                4-3-3 ready to go. Everything you place is saved to your
                account.
              </DocP>
              <DocList
                items={[
                  "Sign up for free — no card required",
                  "Open the builder from the dashboard or sidebar",
                  "Place players, switch formations, and hit save",
                  "Your lineups appear under Lineups, ready to edit or share",
                ]}
              />
            </DocSection>

            <div className="mt-12" />

            <DocSection id="building-lineups">
              <DocH2 id="building-lineups">Building a lineup</DocH2>
              <DocP>
                The builder is a football pitch with eleven slots. Each slot
                accepts a player from your team or the search results.
              </DocP>
              <DocList
                items={[
                  "Click an empty slot to add a player",
                  "Click a filled slot to swap or remove the player",
                  "Drag players to reposition or move them between slots",
                  "Empty slots are marked clearly so you always know what's left to fill",
                ]}
              />
              <DocH3>Naming & saving</DocH3>
              <DocP>
                Give your lineup a name (for example, "Away vs City — high
                press") before saving. You can duplicate a lineup to build
                variations without disturbing the original.
              </DocP>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="formations">
              <DocH2 id="formations">Formations</DocH2>
              <DocP>
                Switch formations at any time from the formation selector. When
                you switch, players are mapped to the nearest equivalent slot by
                role so you keep as much of your eleven as possible.
              </DocP>
              <DocTable
                headers={["Category", "Examples"]}
                rows={[
                  ["Standard", "4-3-3, 4-4-2, 4-5-1"],
                  ["Attacking", "4-3-3 Attack, 4-2-1-3"],
                  ["Defensive", "5-3-2, 5-4-1, 4-1-4-1"],
                  ["Wing-based", "3-5-2, 3-4-3, 3-4-2-1"],
                ]}
              />
              <DocP>
                A full list of every supported formation is available in the
                builder's formation picker.
              </DocP>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="teams">
              <DocH2 id="teams">Teams</DocH2>
              <DocP>
                Teams group players so you can build lineups from a known squad
                instead of searching every time.
              </DocP>
              <DocList
                items={[
                  "Create a team with a name, optional badge, and league",
                  "Add players to a team from the team page",
                  "When building a lineup, pick a team to see only its players",
                  "Teams let your lineup stats reflect your real squad",
                ]}
              />
            </DocSection>

            <div className="mt-12" />

            <DocSection id="sharing">
              <DocH2 id="sharing">Sharing a lineup</DocH2>
              <DocP>
                Every lineup can be shared with a single link. The shared view
                is read-only — viewers see the pitch, the players, and the
                stats, but cannot edit.
              </DocP>
              <DocList
                items={[
                  "Open a lineup and press Share to generate a link",
                  "Copy the link to WhatsApp, email, or a group chat",
                  "Viewers open the link to see the lineup on any device",
                  "Delete the share link anytime to stop access",
                ]}
              />
              <DocCallout title="Visibility">
                Anyone with the link can view the lineup. Treat shared links
                like public URLs.
              </DocCallout>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="stats">
              <DocH2 id="stats">Reading stats</DocH2>
              <DocP>
                The{" "}
                <Link href="/stats" className="rounded-sm text-accent-light transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
                  stats page
                </Link>{" "}
                turns your saved work into a season ledger:
              </DocP>
              <DocList
                items={[
                  "Lineups drawn, teams managed, and links created",
                  "Views your shared lineups have earned",
                  "Your most-used formations",
                  "The players you lean on most",
                  "A timeline of your activity",
                ]}
              />
              <DocP>
                The per-lineup stats panel shows average rating, average age,
                position distribution, and rating spread at a glance.
              </DocP>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="shortcuts">
              <DocH2 id="shortcuts">Shortcuts</DocH2>
              <DocTable headers={["Shortcut", "Action"]} rows={SHORTCUTS} />
              <DocP>
                Need help beyond this guide? Visit the{" "}
                <Link href="/support" className="rounded-sm text-accent-light transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
                  support page
                </Link>{" "}
                or the{" "}
                <Link href="/api" className="rounded-sm text-accent-light transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
                  API reference
                </Link>{" "}
                for integration details.
              </DocP>
            </DocSection>

            <div className="mt-10">
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-text-secondary transition-all hover:border-border-hover hover:text-foreground"
              >
                Open the builder
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
