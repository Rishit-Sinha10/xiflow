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
  { href: "#agreement", label: "Agreement" },
  { href: "#accounts", label: "Accounts" },
  { href: "#acceptable-use", label: "Acceptable use" },
  { href: "#your-content", label: "Your content" },
  { href: "#service", label: "The Service" },
  { href: "#disclaimers", label: "Disclaimers" },
  { href: "#liability", label: "Limitation of liability" },
  { href: "#termination", label: "Termination" },
  { href: "#changes", label: "Changes to terms" },
  { href: "#contact", label: "Contact" },
];

export const metadata = {
  title: "Terms of Service — xiflow",
  description:
    "The terms that govern your use of xiflow, the tactical lineup builder.",
};

export default function TermsPage() {
  return (
    <PublicShell>
      <DocHeader
        eyebrow="Legal"
        title="Terms of Service"
        description="Clear ground rules for using xiflow. You own your lineups. We provide the tools."
        updated="July 3, 2026"
      />

      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
        <div className="flex gap-12">
          <Toc items={TOC} />

          <div className="min-w-0 flex-1 max-w-3xl">
            <DocSection id="agreement">
              <DocH2 id="agreement">1. Agreement</DocH2>
              <DocP>
                By accessing or using xiflow (the "Service"), you agree to these
                Terms of Service. If you do not agree, do not use the Service.
              </DocP>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="accounts">
              <DocH2 id="accounts">2. Accounts</DocH2>
              <DocList
                items={[
                  "You are responsible for safeguarding your login credentials.",
                  "You must provide accurate account information.",
                  "You must be at least 13 years old to use the Service.",
                  "You are responsible for all activity under your account.",
                ]}
              />
              <DocP>
                If you believe your account has been compromised, contact us
                immediately and change your password.
              </DocP>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="acceptable-use">
              <DocH2 id="acceptable-use">3. Acceptable use</DocH2>
              <DocP>You agree not to:</DocP>
              <DocList
                items={[
                  "Attempt to access another user's account or private lineups",
                  "Use the Service to infringe others' rights or share unlawful content",
                  "Attempt to disrupt, overload, or damage the Service or its infrastructure",
                  "Scrape or bulk-extract public content without permission",
                  "Reverse engineer the Service beyond what the law permits",
                ]}
              />
            </DocSection>

            <div className="mt-12" />

            <DocSection id="your-content">
              <DocH2 id="your-content">4. Your content</DocH2>
              <DocP>
                You retain full ownership of the lineups, teams, and other
                content you create. We claim no ownership over your content.
              </DocP>
              <DocP>
                By sharing a lineup via a link, you grant others viewing rights
                to that lineup for its intended purpose. You are responsible for
                the content you share and for ensuring you have the right to
                share it (for example, player names and images from external
                sources).
              </DocP>
              <DocCallout title="Shared content">
                Lineups you share become publicly viewable by anyone with the
                link. Choose what you share carefully.
              </DocCallout>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="service">
              <DocH2 id="service">5. The Service</DocH2>
              <DocP>
                We work hard to keep xiflow available, but we do not guarantee
                uninterrupted access. We may modify, suspend, or discontinue
                features at any time. Where practical, we will announce material
                changes in advance.
              </DocP>
              <DocH3>Third-party data</DocH3>
              <DocP>
                Some content in the Service may reference player data and team
                information from third-party sources. This data is provided "as
                is" for informational and educational use and may not be current
                or complete.
              </DocP>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="disclaimers">
              <DocH2 id="disclaimers">6. Disclaimers</DocH2>
              <DocP>
                The Service is provided "as is" and "as available," without
                warranties of any kind, whether express or implied — including
                warranties of merchantability, fitness for a particular purpose,
                or non-infringement. We do not warrant that the Service will be
                error-free or that tactical data will be accurate.
              </DocP>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="liability">
              <DocH2 id="liability">7. Limitation of liability</DocH2>
              <DocP>
                To the maximum extent permitted by law, xiflow and its operators
                will not be liable for indirect, incidental, special,
                consequential, or punitive damages, or for any loss of data,
                revenue, or profits, arising from your use of the Service.
              </DocP>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="termination">
              <DocH2 id="termination">8. Termination</DocH2>
              <DocP>
                You may stop using the Service at any time and delete your
                account. We may suspend or terminate access to the Service if
                you materially breach these terms. Upon termination, we will
                delete your data in line with our privacy policy.
              </DocP>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="changes">
              <DocH2 id="changes">9. Changes to terms</DocH2>
              <DocP>
                We may update these terms from time to time. Material changes
                will be announced on the changelog. Continued use of the Service
                after changes take effect constitutes acceptance of the updated
                terms.
              </DocP>
            </DocSection>

            <div className="mt-12" />

            <DocSection id="contact">
              <DocH2 id="contact">10. Contact</DocH2>
              <DocP>
                Questions about these terms? Contact us at{" "}
                <a
                  href="mailto:legal@xiflow.app"
                  className="rounded-sm text-accent-light transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                >
                  legal@xiflow.app
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
