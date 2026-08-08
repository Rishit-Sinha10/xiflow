"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Crosshair, Menu, X, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/auth_context";
import AuthModal from "@/components/AuthModal";
import Button from "@/components/shared/Button";

export default function PublicShell({ children }) {
  const [navOpen, setNavOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "signin") {
      setAuthMode("signin");
      setAuthOpen(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const navLinks = [
    { label: "Documentation", href: "/documentation" },
    { label: "API", href: "/api" },
    { label: "Changelog", href: "/changelog" },
    { label: "Support", href: "/support" },
  ];

  function openSignIn() {
    if (user) {
      router.push("/dashboard");
      return;
    }
    setAuthMode("signin");
    setAuthOpen(true);
  }

  function openSignUp() {
    if (user) {
      router.push("/dashboard");
      return;
    }
    setAuthMode("signup");
    setAuthOpen(true);
  }

  return (
    <main className="flex min-h-screen flex-col bg-background font-sans antialiased selection:bg-accent/30">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-overlay">
              <Crosshair className="h-4 w-4 text-foreground" strokeWidth={1.75} />
            </div>
            <span className="text-base font-semibold tracking-tight text-foreground">
              xiflow
            </span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-sm font-mono text-[11px] uppercase tracking-[0.15em] text-text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <Button onClick={() => router.push("/dashboard")}>Dashboard</Button>
            ) : (
              <>
                <button
                  onClick={openSignIn}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-foreground"
                >
                  Sign in
                </button>
                <Button onClick={openSignUp}>Get started</Button>
              </>
            )}
          </div>

          <button
            className="rounded-sm text-foreground lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            onClick={() => setNavOpen((v) => !v)}
            aria-label={navOpen ? "Close menu" : "Open menu"}
          >
            {navOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        <AnimatePresence>
          {navOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-b border-border bg-background lg:hidden"
            >
              <div className="flex flex-col gap-4 px-6 py-6">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setNavOpen(false)}
                    className="rounded-sm font-mono text-xs uppercase tracking-[0.15em] text-text-muted"
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="mt-2 flex flex-col gap-3">
                  {user ? (
                    <Button onClick={() => router.push("/dashboard")} className="w-full">
                      Dashboard
                    </Button>
                  ) : (
                    <>
                      <button
                        onClick={openSignIn}
                        className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-secondary"
                      >
                        Sign in
                      </button>
                      <Button onClick={openSignUp} className="w-full">
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

      <div className="flex-1">{children}</div>

      <footer className="border-t border-border bg-background px-6 py-12 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-overlay">
              <Crosshair className="h-4 w-4 text-foreground" strokeWidth={1.75} />
            </div>
            <div>
              <span className="block text-sm font-semibold tracking-tight text-foreground">
                xiflow
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-text-muted">
                Tactics for the margins
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.15em] text-text-muted">
            <Link href="/privacy" className="rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
              Privacy
            </Link>
            <Link href="/terms" className="rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
              Terms
            </Link>
            <Link href="/documentation" className="rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
              Docs
            </Link>
            <Link href="/support" className="rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
              Support
            </Link>
            <Link href="/api" className="rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
              API
            </Link>
            <Link href="/changelog" className="rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
              Changelog
            </Link>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-text-muted transition-colors hover:text-foreground"
          >
            Back to home
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </footer>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
    </main>
  );
}
