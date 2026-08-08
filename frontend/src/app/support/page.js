import PublicShell from "@/components/layout/PublicShell";
import { DocHeader, DocH2, DocP, Toc } from "@/components/layout/DocLayout";

const FAQ = [
  {
    q: "Is xiflow really free?",
    a: "Yes. The free tier includes all formations, unlimited lineups, teams, sharing, and stats. There is no credit card and no time limit.",
  },
  {
    q: "Do I need an account to use xiflow?",
    a: "To save and share lineups, yes. The demo on the home page lets you try the builder without an account first.",
  },
  {
    q: "Can I share a lineup without letting people edit it?",
    a: "Yes. Shared lineups are always read-only. Viewers see the pitch, players, and stats but can't change anything.",
  },
  {
    q: "How do I delete a shared link?",
    a: "Open the lineup, go to the share options, and delete the link. The link stops working immediately.",
  },
  {
    q: "What happens to my data if I delete my account?",
    a: "Your lineups, teams, and share links are deleted from our servers. See the privacy policy for details.",
  },
  {
    q: "Where is my data stored?",
    a: "xiflow runs on Firebase (Google Cloud). Your data lives in Firestore behind security rules that only let you access your own content.",
  },
  {
    q: "Can I export my lineups?",
    a: "Not yet. Export is on the roadmap — you'll be able to take your lineups and teams with you at any time.",
  },
  {
    q: "What should I do if I find a bug?",
    a: "Report it via email below. Include what you were doing, what happened, and a screenshot if possible. We'll acknowledge it quickly.",
  },
];

export const metadata = {
  title: "Support — xiflow",
  description:
    "Answers to common questions about xiflow, plus how to reach us for help.",
};

export default function SupportPage() {
  return (
    <PublicShell>
      <DocHeader
        eyebrow="Support"
        title="How can we help?"
        description="Straight answers to the questions we hear most. If yours isn't here, write to us."
        updated="July 3, 2026"
      />

      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
        <div className="flex gap-12">
          <nav className="hidden w-56 shrink-0 lg:block">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
              FAQ
            </p>
            <ul className="mt-4 space-y-2.5">
              {FAQ.map((item) => (
                <li key={item.q}>
                  <a
                    href={`#${item.q.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}
                    className="rounded-sm text-sm text-text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                  >
                    {item.q}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 flex-1 max-w-3xl">
            <div className="space-y-10">
              {FAQ.map((item) => {
                const id = item.q
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "");
                return (
                  <section key={id} id={id} className="scroll-mt-24">
                    <DocH2 id={id}>{item.q}</DocH2>
                    <DocP>{item.a}</DocP>
                  </section>
                );
              })}
            </div>

            <div className="mt-16 rounded-2xl border border-accent/25 bg-accent/5 p-8">
              <h2 className="text-xl font-bold tracking-[-0.01em] text-foreground sm:text-2xl">
                Still stuck?
              </h2>
              <p className="mt-3 max-w-lg text-[15px] leading-[1.7] text-text-secondary">
                Send us a message and we'll get back to you — usually within a
                couple of days. Include what you were doing and what you
                expected to happen.
              </p>
              <a
                href="mailto:support@xiflow.app"
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-accent/90 active:scale-[0.97]"
              >
                Email support@xiflow.app
              </a>
            </div>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
