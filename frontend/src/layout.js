"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  Crosshair,
  ArrowRight,
  Menu,
  X,
  TrendingUp,
  Share2,
  MousePointerClick,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/auth_context";
import AuthModal from "@/components/AuthModal";
import Button from "@/components/shared/Button";
import Badge from "@/components/shared/Badge";
import { FORMATIONS } from "@/lib/formations";
import DemoBuilder from "@/components/landing/DemoBuilder";
import { buildDemoLineup, DEMO_FORMATION_CYCLE } from "@/components/landing/demoData";
import LineupStatsPanel from "@/components/lineup/LineupStatsPanel";
import { Reveal } from "@/components/landing/Reveal";
import Link from "next/link";
function Eyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
      <span className="h-px w-5 bg-text-muted" />
      {children}
    </span>
  );
}
const FORMATION_COUNT = Object.keys(FORMATIONS).length;
function HeroDemo() {
  const [active, setActive] = useState(DEMO_FORMATION_CYCLE[0]);
  const [index, setIndex] = useState(0);
  const paused = useRef(false);
  const reduce = useReducedMotion();

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % DEMO_FORMATION_CYCLE.length);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      if (!paused.current) advance();
    }, 3400);
    return () => clearInterval(id);
  }, [advance, reduce]);

  useEffect(() => {
    setActive(DEMO_FORMATION_CYCLE[index]);
  }, [index]);

  return (
    <div className="w-full">
      <div
        className="relative mx-auto max-w-[360px]"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onFocusCapture={() => (paused.current = true)}
        onBlurCapture={() => (paused.current = false)}
      >
        <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-accent/10 blur-[80px]" />
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-muted">
            xiflow · {active}
          </span>
        </div>
        <DemoBuilder formationId={active} showStats={false} />
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {DEMO_FORMATION_CYCLE.map((id) => (
          <button
            key={id}
            onClick={() => {
              paused.current = true;
              setActive(id);
              setIndex(DEMO_FORMATION_CYCLE.indexOf(id));
            }}
            className={`rounded-lg border px-3.5 py-1.5 font-mono text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${
              active === id
                ? "border-accent bg-accent/10 text-accent-light"
                : "border-border text-text-muted hover:border-border-hover hover:text-text-secondary"
            }`}
          >
            {id}
          </button>
        ))}
      </div>
    </div>
  );
}

function Navbar({ onSignIn, onSignUp }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Features", href: "#features" },
    { label: "Demo", href: "#demo" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-border bg-background/90 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-overlay">
            <Crosshair className="h-4 w-4 text-foreground" strokeWidth={1.75} />
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">
            xiflow
          </span>
        </div>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-sm font-mono text-[11px] uppercase tracking-[0.15em] text-text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <Button onClick={() => router.push("/dashboard")}>Dashboard</Button>
          ) : (
            <>
              <button
                onClick={onSignIn}
                className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-foreground"
              >
                Sign in
              </button>
              <Button onClick={onSignUp}>Get started</Button>
            </>
          )}
        </div>

        <button
          className="rounded-sm text-foreground lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-b border-border bg-background lg:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-sm font-mono text-xs uppercase tracking-[0.15em] text-text-muted"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-3">
                {user ? (
                  <Button onClick={() => router.push("/dashboard")} className="w-full">
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <button
                      onClick={onSignIn}
                      className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-secondary"
                    >
                      Sign in
                    </button>
                    <Button onClick={onSignUp} className="w-full">
                      Get started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero({ onSignUp }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  function scrollToDemo() {
    const el = document.getElementById("demo");
    if (!el) return;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-background pt-20"
    >
      <motion.div
        style={reduce ? undefined : { opacity }}
        className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20 lg:px-8"
      >
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div>
            <Reveal>
              <Eyebrow>Interactive tactics platform</Eyebrow>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-6 max-w-xl text-5xl font-bold leading-[0.95] tracking-[-0.02em] text-foreground sm:text-6xl lg:text-[72px] lg:leading-[0.92]">
                Command your
                <br />
                <span className="text-accent">tactics.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-md text-base leading-[1.7] text-text-secondary">
                Build, analyze, and share tactical lineups on a real pitch.
                Switch formations, place your players, and see the balance
                instantly — all before kickoff.
              </p>
            </Reveal>

            <Reveal delay={0.24} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={onSignUp}>
                Start building for free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="ghost" onClick={scrollToDemo}>
                See the live demo
              </Button>
            </Reveal>

            <Reveal delay={0.32} className="mt-8">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {FORMATION_COUNT} formations
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  No card required
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Free forever tier
                </span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="flex items-center justify-center">
            <HeroDemo />
          </Reveal>
        </div>
      </motion.div>
    </section>
  );
}

function FactBar() {
  const facts = [
    { value: `${FORMATION_COUNT}`, label: "Formations built in" },
    { value: "11", label: "Players on the pitch" },
    { value: "1", label: "Link to share your plan" },
    { value: "$0", label: "To start building" },
  ];

  return (
    <section className="border-y border-border bg-background px-6 py-10 lg:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 text-center md:grid-cols-4">
        {facts.map(({ value, label }, i) => (
          <Reveal key={label} delay={i * 0.08}>
            <div>
              <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {value}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-text-muted">
                {label}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: MousePointerClick,
      title: "Build the eleven",
      desc: "Drag players onto a live pitch across 18 tactical setups. Every position placed precisely, every swap felt instantly.",
    },
    {
      icon: TrendingUp,
      title: "Read the balance",
      desc: "Live lineup stats — average rating, age, and position spread. Spot the gap in your setup before the whistle.",
    },
    {
      icon: Share2,
      title: "Share the plan",
      desc: "Distribute your tactics with a single link. Coaches, staff, and players see the same board on any device.",
    },
  ];

  return (
    <section className="bg-surface px-6 py-24 lg:px-8" id="features">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-14 max-w-lg">
          <Eyebrow>What you can do</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl lg:text-5xl">
            Built for the bench,
            <br />
            not the boardroom.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {items.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 0.1}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-border bg-background p-8 transition-all duration-500 hover:border-border-hover">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-overlay">
                  <Icon className="h-[18px] w-[18px] text-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-3 text-[15px] leading-[1.65] text-text-secondary">{desc}</p>
                <div className="absolute bottom-0 left-0 h-px w-0 bg-foreground/15 transition-all duration-500 group-hover:w-full" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveDemo() {
  const [active, setActive] = useState("4-3-3");
  const formation = FORMATIONS[active] || FORMATIONS["4-3-3"];
  const lineup = buildDemoLineup(formation.slots);

  return (
    <section className="relative overflow-hidden bg-background px-6 py-24 lg:px-8" id="demo">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/5 blur-[100px]" />
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-12 text-center">
          <Eyebrow>Try it — it works</Eyebrow>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl lg:text-5xl">
            The same board your
            <br className="hidden sm:block" />
            squad will see on matchday.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.7] text-text-secondary">
            Pick a formation. Watch the eleven reshape and the stats recalculate
            live. This is the builder you get the moment you sign up.
          </p>
        </Reveal>

        <Reveal>
          <div className="mx-auto grid max-w-4xl grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_340px]">
            <div className="mx-auto w-full max-w-[340px] lg:max-w-none">
              <DemoBuilder formationId={active} showStats={false} />
            </div>
            <div className="w-full">
              <div className="mb-4 flex flex-wrap gap-2">
                {Object.keys(FORMATIONS).map((id) => (
                  <button
                    key={id}
                    onClick={() => setActive(id)}
                    className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${
                      active === id
                        ? "border-accent bg-accent/10 text-accent-light"
                        : "border-border text-text-muted hover:border-border-hover hover:text-text-secondary"
                    }`}
                  >
                    {id}
                  </button>
                ))}
              </div>
              <LineupStatsPanel players={lineup} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Pick your formation",
      desc: `Choose from ${FORMATION_COUNT} tactical setups. Every formation places your squad exactly where they need to be.`,
    },
    {
      number: "02",
      title: "Assign your players",
      desc: "Drag players into position or pick from your squad. Fine-tune roles and responsibilities.",
    },
    {
      number: "03",
      title: "Share and collaborate",
      desc: "Generate a shareable link. Your lineup is live, accessible anywhere, ready for feedback.",
    },
  ];

  return (
    <section className="bg-surface px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-16 max-w-lg">
          <Eyebrow>Simple workflow</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl lg:text-5xl">
            Three steps to
            <br />
            match-ready tactics.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map(({ number, title, desc }, i) => (
            <Reveal key={number} delay={i * 0.1}>
              <div className="relative">
                <span className="font-mono text-5xl font-bold tracking-tight text-accent/20">
                  {number}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-3 text-[15px] leading-[1.65] text-text-secondary">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ onSignUp }) {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      tagline: "Everything you need to plan matchday.",
      cta: "Start for free",
      ctaVariant: "primary",
      features: [
        "All formations, unlimited lineups",
        "Save and revisit your plans",
        "Share links for any lineup",
        "Lineup stats panel",
      ],
    },
    {
      name: "Pro",
      price: "Soon",
      period: "early access",
      tagline: "Built for staffs who live in the tactics room.",
      cta: "Join the waitlist",
      ctaVariant: "solid",
      features: [
        "Advanced analytics and trends",
        "Squad and team workspaces",
        "Player search and data",
        "Everything in Free",
      ],
    },
  ];

  return (
    <section className="bg-background px-6 py-24 lg:px-8" id="pricing">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-14 text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="mx-auto mt-4 max-w-xl text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl lg:text-5xl">
            Start free. Upgrade when
            <br className="hidden sm:block" />
            the season demands it.
          </h2>
        </Reveal>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-5 md:grid-cols-2">
          {tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.1}>
              <article
                className={`flex h-full flex-col rounded-2xl border p-8 ${
                  tier.ctaVariant === "primary"
                    ? "border-accent/30 bg-surface"
                    : "border-border bg-surface"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
                  {tier.ctaVariant === "primary" && (
                    <Badge variant="accent">Popular</Badge>
                  )}
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight text-foreground">
                    {tier.price}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
                    / {tier.period}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {tier.tagline}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-text-secondary">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-2">
                  <Button
                    variant={tier.ctaVariant}
                    className="w-full"
                    onClick={tier.ctaVariant === "primary" ? onSignUp : undefined}
                  >
                    {tier.cta}
                  </Button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA({ onSignUp }) {
  return (
    <section className="bg-surface px-6 py-28 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl lg:text-5xl">
          Your next eleven is waiting.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-[1.7] text-text-secondary">
          Set up in two minutes, no card required. Build your first lineup and
          share it with your squad before the next training session.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" onClick={onSignUp}>
            Start building for free
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="ghost" onClick={() => {
            const el = document.getElementById("demo");
            el?.scrollIntoView({ behavior: "smooth" });
          }}>
            See the live demo
          </Button>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  const columns = [
    {
      title: "Product",
      links: [
        { label: "Builder", href: "/builder" },
        { label: "Lineups", href: "/lineups" },
        { label: "Teams", href: "/teams" },
        { label: "Stats", href: "/stats" },
      ],
    },
    {
      title: "Platform",
      links: [
        { label: "Features", href: "#features" },
        { label: "Live demo", href: "#demo" },
        { label: "Pricing", href: "#pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Documentation", href: "/documentation" },
        { label: "Support", href: "/support" },
        { label: "API", href: "/api" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-background px-6 py-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-overlay">
                <Crosshair className="h-4 w-4 text-foreground" strokeWidth={1.75} />
              </div>
              <span className="text-base font-semibold tracking-tight text-foreground">
                xiflow
              </span>
            </div>
            <p className="mt-4 max-w-[220px] text-sm leading-relaxed text-text-muted">
              The tactics platform for coaching staffs who play for margins.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[11px] uppercase tracking-[0.15em] text-text-secondary">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="rounded-sm text-sm text-text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <span className="font-mono text-[11px] text-text-muted">
            &copy; 2026 xiflow. All rights reserved.
          </span>
          <div className="flex gap-6 font-mono text-[11px] text-text-muted">
            <Link href="/privacy" className="rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
              Privacy
            </Link>
            <Link href="/terms" className="rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function TacticForgeLanding() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "signin") {
      openSignIn();
      window.history.replaceState({}, "", window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function openSignIn() {
    if (user) {
      router.push("/dashboard");
      return;
    }
    setAuthMode("signin");
    setAuthModalOpen(true);
  }

  function openSignUp() {
    if (user) {
      router.push("/dashboard");
      return;
    }
    setAuthMode("signup");
    setAuthModalOpen(true);
  }

  function closeAuthModal() {
    setAuthModalOpen(false);
  }

  return (
    <main className="bg-background font-sans antialiased selection:bg-accent/30">
      <Navbar onSignIn={openSignIn} onSignUp={openSignUp} />
      <Hero onSignUp={openSignUp} />
      <FactBar />
      <Features />
      <LiveDemo />
      <HowItWorks />
      <Pricing onSignUp={openSignUp} />
      <CTA onSignUp={openSignUp} />
      <Footer />
      <AuthModal
        open={authModalOpen}
        onClose={closeAuthModal}
        initialMode={authMode}
      />
    </main>
  );
}
