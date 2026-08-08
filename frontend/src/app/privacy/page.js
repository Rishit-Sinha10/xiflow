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
  { href: "#overview", label: "Overview" },
  { href: "#data-we-collect", label: "What we collect" },
  { href: "#how-we-use", label: "How we use it" },
  { href: "#storage", label: "Storage & security" },
  { href: "#sharing", label: "Who we share with" },
  { href: "#cookies", label: "Cookies & local storage" },
  { href: "#your-rights", label: "Your rights" },
  { href: "#retention", label: "Retention" },
  { href: "#children", label: "Children" },
  { href: "#changes", label: "Changes to this policy" },
  { href: "#contact", label: "Contact" },
];

export const metadata = {
  title: "Privacy Policy — xiflow",
  description:
    "How xiflow collects, uses, stores, and protects your data when you build and share tactical lineups.",
};

export default function PrivacyPage() {
  return (
    <PublicShell>
      <DocHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="The short version: we store what we need to run the product — your account, your lineups, your teams — and we never sell it."
        updated="July 3, 2026"
      />

      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
        <div className="flex gap-12">
          <Toc items={TOC} />

          <div className="min-w-0 flex-1 max-w-3xl">
            <DocSection id="overview">
              <DocH2 id="overview">1. Overview</DocH2>
              <DocP>
                xiflow (the "Service") is a football tactics platform that lets
                you build, save, share, and analyze tactical lineups. This
                Privacy Policy explains what information we collect, why we
                collect it, and the choices you have. By using the Service, you
                agree to the practices described here.
              </DocP>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="data-we-collect">
              <DocH2 id="data-we-collect">2. What we collect</DocH2>
              <DocH3>Account information</DocH3>
              <DocP>
                When you create an account we collect your name, email address,
                and a password (or a Google sign-in identifier if you choose
                that method). Authentication is handled by Firebase Auth.
              </DocP>
              <DocH3>Content you create</DocH3>
              <DocList
                items={[
                  "Lineups — formations, player placements, names, ratings, and notes",
                  "Teams — team name, badge URL, and members",
                  "Share links — generated links and view counts",
                  "Stats — aggregates computed from your lineups and sharing activity",
                ]}
              />
              <DocH3>Usage data</DocH3>
              <DocP>
                We collect limited analytics such as which pages you visit and
                which features you use, so we can improve the product. This does
                not include your tactical content.
              </DocP>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="how-we-use">
              <DocH2 id="how-we-use">3. How we use it</DocH2>
              <DocList
                items={[
                  "To create and manage your account",
                  "To save, retrieve, and sync your lineups and teams",
                  "To generate share links and record views",
                  "To compute your stats dashboard",
                  "To respond to support requests",
                  "To improve the product through usage analytics",
                ]}
              />
            </DocSection>

            <div className="mt-12" />

            <DocSection id="storage">
              <DocH2 id="storage">4. Storage & security</DocH2>
              <DocP>
                Your data is stored in Firebase (Google Cloud) Firestore, the
                same infrastructure used by Google's own services. Access is
                governed by Firestore security rules that allow you to read and
                write only your own data, and allow public read access only for
                lineups you choose to share via a link.
              </DocP>
              <DocCallout title="A note on shared lineups">
                Anything you share via a link becomes publicly viewable by
                anyone with that link. Never include sensitive personal
                information in a lineup you intend to share.
              </DocCallout>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="sharing">
              <DocH2 id="sharing">5. Who we share with</DocH2>
              <DocList
                items={[
                  "Google / Firebase — for authentication, database, and hosting",
                  "Service providers who help operate the Service, under confidentiality obligations",
                ]}
              />
              <DocP>
                We do not sell, rent, or trade your personal information. We do
                not share your lineups or teams with third parties except as
                required to operate the Service or by law.
              </DocP>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="cookies">
              <DocH2 id="cookies">6. Cookies & local storage</DocH2>
              <DocP>
                We use browser local storage to keep you signed in and remember
                your theme preference. We do not use third-party advertising
                cookies.
              </DocP>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="your-rights">
              <DocH2 id="your-rights">7. Your rights</DocH2>
              <DocList
                items={[
                  "Access a copy of your account data",
                  "Correct or update inaccurate information",
                  "Export your lineups and teams",
                  "Delete your account and associated data",
                  "Withdraw consent for optional analytics",
                ]}
              />
              <DocP>
                To exercise any of these rights, contact us using the details
                below. We will respond within 30 days.
              </DocP>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="retention">
              <DocH2 id="retention">8. Retention</DocH2>
              <DocP>
                We keep your account data for as long as your account is active.
                When you delete your account, we delete your lineups, teams, and
                share links within a reasonable period. Share links you created
                for public lineups are removed when the lineup is deleted.
              </DocP>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="children">
              <DocH2 id="children">9. Children</DocH2>
              <DocP>
                The Service is not directed at children under 13. We do not
                knowingly collect personal information from children under 13.
                If you believe a child has provided us personal information,
                contact us and we will delete it.
              </DocP>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="changes">
              <DocH2 id="changes">10. Changes to this policy</DocH2>
              <DocP>
                We may update this policy as the Service evolves. Material
                changes will be announced on the changelog and, where required,
                via email. Continued use of the Service after changes means you
                accept the updated policy.
              </DocP>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="contact">
              <DocH2 id="contact">11. Contact</DocH2>
              <DocP>
                Questions about this policy or your data? Reach us at{" "}
                <a
                  href="mailto:privacy@xiflow.app"
                  className="rounded-sm text-accent-light transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                >
                  privacy@xiflow.app
                </a>
                .
              </DocP>
            </DocSection>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
