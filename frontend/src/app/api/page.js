import PublicShell from "@/components/layout/PublicShell";
import {
  DocHeader,
  DocSection,
  DocH2,
  DocP,
  DocCallout,
  DocTable,
  DocCode,
  DocBlock,
  Toc,
} from "@/components/layout/DocLayout";

const TOC = [
  { href: "#status", label: "Status" },
  { href: "#overview", label: "Overview" },
  { href: "#auth", label: "Authentication" },
  { href: "#lineups", label: "Lineups" },
  { href: "#teams", label: "Teams" },
  { href: "#share", label: "Sharing" },
  { href: "#errors", label: "Errors" },
];

const AUTH_ROWS = [
  [<DocCode key="m">POST</DocCode>, "/api/auth/register", "Register a new user"],
  [<DocCode key="m">POST</DocCode>, "/api/auth/login", "Log in and receive a token"],
  [<DocCode key="m">GET</DocCode>, "/api/auth/user", "Get the current user profile"],
  [<DocCode key="m">POST</DocCode>, "/api/auth/logout", "Invalidate the current session"],
];

const LINEUP_ROWS = [
  [<DocCode key="m">GET</DocCode>, "/api/lineups", "List the caller's lineups"],
  [<DocCode key="m">GET</DocCode>, "/api/lineups/:id", "Get a single lineup"],
  [<DocCode key="m">POST</DocCode>, "/api/lineups", "Create a lineup"],
  [<DocCode key="m">PUT</DocCode>, "/api/lineups/:id", "Update a lineup"],
  [<DocCode key="m">DELETE</DocCode>, "/api/lineups/:id", "Delete a lineup"],
  [<DocCode key="m">POST</DocCode>, "/api/lineups/:id/duplicate", "Duplicate a lineup"],
];

const TEAM_ROWS = [
  [<DocCode key="m">GET</DocCode>, "/api/teams", "List the caller's teams"],
  [<DocCode key="m">POST</DocCode>, "/api/teams", "Create a team"],
  [<DocCode key="m">GET</DocCode>, "/api/teams/:id", "Get a team"],
  [<DocCode key="m">PUT</DocCode>, "/api/teams/:id", "Update a team"],
  [<DocCode key="m">DELETE</DocCode>, "/api/teams/:id", "Delete a team"],
];

const SHARE_ROWS = [
  [<DocCode key="m">POST</DocCode>, "/api/share/lineups/:id", "Create a share link"],
  [<DocCode key="m">GET</DocCode>, "/api/share/:accessCode", "Fetch a shared lineup"],
  [<DocCode key="m">DELETE</DocCode>, "/api/share/:shareId", "Revoke a share link"],
];

const ERROR_ROWS = [
  ["400", "Bad request", "Missing or invalid fields"],
  ["401", "Unauthorized", "Missing or invalid token"],
  ["403", "Forbidden", "Not the owner of this resource"],
  ["404", "Not found", "The resource does not exist"],
  ["429", "Rate limited", "Too many requests, slow down"],
  ["500", "Server error", "Something broke on our side"],
];

export const metadata = {
  title: "API Reference — xiflow",
  description:
    "The planned xiflow REST API for lineups, teams, and sharing.",
};

export default function ApiPage() {
  return (
    <PublicShell>
      <DocHeader
        eyebrow="Developers"
        title="API Reference"
        description="The xiflow REST API lets you build, manage, and share lineups programmatically."
        updated="July 3, 2026"
      />

      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
        <div className="flex gap-12">
          <Toc items={TOC} />

          <div className="min-w-0 flex-1 max-w-3xl">
            <DocSection id="status">
              <DocCallout title="Coming soon">
                The public API ships with the backend. The contract below is the
                target we're building against — endpoints, shapes, and errors
                may change before release. Follow the changelog for the
                announcement.
              </DocCallout>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="overview">
              <DocH2 id="overview">Overview</DocH2>
              <DocP>
                The API is RESTful and returns JSON. All write and read
                endpoints for private resources require authentication. Public
                shared lineups can be fetched without a token.
              </DocP>
              <DocBlock>
                Base URL: https://api.xiflow.app/v1{`\n`}Content-Type:
                application/json
              </DocBlock>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="auth">
              <DocH2 id="auth">Authentication</DocH2>
              <DocP>
                Authenticated requests carry a bearer token in the{" "}
                <DocCode>Authorization</DocCode> header:
              </DocP>
              <DocBlock>
                Authorization: Bearer {"<token>"}
              </DocBlock>
              <DocH2 id="auth">Auth endpoints</DocH2>
              <DocTable headers={["Method", "Path", "Description"]} rows={AUTH_ROWS} />
            </DocSection>

            <div className="mt-12" />

            <DocSection id="lineups">
              <DocH2 id="lineups">Lineups</DocH2>
              <DocP>
                A lineup describes a formation and the players assigned to each
                slot. The caller may only read, update, and delete their own
                lineups.
              </DocP>
              <DocTable headers={["Method", "Path", "Description"]} rows={LINEUP_ROWS} />
              <DocP>
                A lineup payload includes the formation id, a name, and a
                players map of slot id to player:
              </DocP>
              <DocBlock>
                {"{"}
                {`\n`}  "id": "ln_1abc",
                {`\n`}  "name": "Away vs City",
                {`\n`}  "formation": "4-3-3",
                {`\n`}  "players": {"{"}
                {`\n`}    "lw": {"{ \"name\": \"...\", \"role\": \"FWD\", \"rating\": 85 }"},
                {`\n`}    // ...
                {`\n`}  {"}"}
                {`\n`}{"}"}
              </DocBlock>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="teams">
              <DocH2 id="teams">Teams</DocH2>
              <DocP>
                Teams group players under a club or squad so lineups can be
                built from a known roster.
              </DocP>
              <DocTable headers={["Method", "Path", "Description"]} rows={TEAM_ROWS} />
            </DocSection>

            <div className="mt-12" />

            <DocSection id="share">
              <DocH2 id="share">Sharing</DocH2>
              <DocP>
                Sharing exposes a lineup publicly via a short access code. The
                shared resource is read-only.
              </DocP>
              <DocTable headers={["Method", "Path", "Description"]} rows={SHARE_ROWS} />
            </DocSection>

            <div className="mt-12" />

            <DocSection id="errors">
              <DocH2 id="errors">Errors</DocH2>
              <DocP>
                Errors return a JSON body with an <DocCode>error</DocCode>
                field describing what went wrong.
              </DocP>
              <DocTable headers={["Status", "Name", "Meaning"]} rows={ERROR_ROWS} />
            </DocSection>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
