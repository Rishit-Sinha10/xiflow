import PublicShell from "@/components/layout/PublicShell";
import {
  DocHeader,
  DocSection,
  DocH2,
  DocH3,
  DocP,
  DocList,
  DocCallout,
  Toc,
} from "@/components/layout/DocLayout";

const TOC = [
  { href: "#unreleased", label: "Unreleased" },
  { href: "#frontend", label: "Frontend" },
  { href: "#backend", label: "Backend" },
  { href: "#changed", label: "Changed" },
  { href: "#v010", label: "v0.1.0" },
];

export const metadata = {
  title: "Changelog — xiflow",
  description:
    "Release notes for xiflow, the tactical lineup builder. Every feature, fix, and change, in one place.",
};

export default function ChangelogPage() {
  return (
    <PublicShell>
      <DocHeader
        eyebrow="Changelog"
        title="Changelog"
        description="Every feature, fix, and change to xiflow — in one place. The format is based on Keep a Changelog and this project adheres to Semantic Versioning."
        updated="August 9, 2026"
      />

      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
        <div className="flex gap-12">
          <Toc items={TOC} />

          <div className="min-w-0 flex-1 max-w-3xl">
            <DocSection id="unreleased">
              <DocH2 id="unreleased">Unreleased</DocH2>
              <DocP>
                The full-stack expansion currently in development. Not yet
                versioned or released.
              </DocP>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="frontend">
              <DocH3>Added · Frontend</DocH3>
              <DocList
                items={[
                  "Landing page with premium hero, feature showcases, and product marketing sections",
                  "Dashboard with quick stats (lineup/team counts), recent lineups, teams, and quick actions",
                  "Lineup Builder (/builder) with player placement on a responsive football pitch",
                  "Formation switching across seven formations: 4-3-3, 4-3-3 Attack, 4-3-3 Holding, 4-4-2, 4-5-1, 4-2-1-3, 4-2-3-1",
                  "Lineup management screens: list, detail (/lineups/[id]), and create (/lineups/create)",
                  "Read-only shared lineup view (/share/[accessCode]) with share-link creation flow",
                  "Team management: list, detail (/teams/[id]), and create (/teams/create) with badge and color customization",
                  "Player search and assignment backed by real player data and a cached player service",
                  "Stats dashboard with activity timeline, formation usage, sharing reach, and top players widgets",
                  "Public pages for documentation, support, privacy policy, and terms of service",
                  "Auth modal with email/password and social login, plus protected routes (RequireAuth)",
                  "Light/dark theme, lineup state, and team state contexts",
                  "Shared component library: Button, Badge, Modal, Toast, Skeleton, Empty, ConfirmDialog, Field, Loading",
                  "Motion and reveal animations via Framer Motion, and animated SVG signature assets",
                  "Open Graph image generation API route (/api/og)",
                  "Firebase client integration and typed API client",
                ]}
              />
            </DocSection>

            <div className="mt-12" />

            <DocSection id="backend">
              <DocH3>Added · Backend</DocH3>
              <DocList
                items={[
                  "Express server with layered architecture (routes / controllers / services)",
                  "Firebase Admin initialization, JWT auth middleware, global error handler, request logging, and input validation",
                  "Authentication routes: register, login, verify token, profile management",
                  "Lineup routes: full CRUD plus duplication and stats",
                  "Team routes: CRUD plus member add/remove",
                  "Player routes: listing, search, filtering by team/position, and cache sync from external data",
                  "Sharing routes: create share links, access shared lineups, delete links, share stats",
                  "Stats routes: user and lineup analytics",
                  "Zod validation and centralized constants/configuration",
                  "Helper script for debugging Firestore roles",
                ]}
              />
            </DocSection>

            <div className="mt-12" />

            <DocSection id="changed">
              <DocH2 id="changed">Changed</DocH2>
              <DocList
                items={[
                  "Migrated pitch, formation, and player components into the new component architecture under src/components/",
                  "Replaced legacy pages/login structure with App Router routes",
                  "Split monolithic frontend API and context code into per-domain services and contexts",
                ]}
              />
            </DocSection>
            <div className="mt-12" />

            <DocSection id="v010">
              <DocH2 id="v010">0.1.0 — 2026-07-03</DocH2>
              <DocP>Initial foundation of the project.</DocP>
              <DocList
                items={[
                  "Initial Next.js frontend foundation",
                  "Responsive football pitch component (Pitchlines.js)",
                  "Formation builder with seven formations and player slots",
                  "Formation definitions library (src/lib/formations.js)",
                  "Firebase client configuration skeleton",
                  "Backend scaffold committed to the repository",
                  ".gitignore corrections to stop tracking Firebase configuration and build artifacts",
                ]}
              />

              <DocCallout title="Keep a Changelog">
                This changelog is maintained alongside the product and updated
                with every meaningful change, following the Keep a Changelog
                format.
              </DocCallout>
            </DocSection>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
