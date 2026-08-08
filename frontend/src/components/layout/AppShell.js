"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth_context";
import Header from "@/components/layout/Header";
import Sidebar, { MobileNav } from "@/components/layout/Sidebar";
import Loading from "@/components/shared/Loading";

export default function AppShell({ children, eyebrow, title, description, actions }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/");
  }, [loading, user, router]);

  if (loading || !user) {
    return <Loading full />;
  }

  return (
    <main className="min-h-screen bg-background font-sans antialiased text-foreground">
      <Header />
      <MobileNav />
      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-10 lg:px-8">
        <Sidebar />
        <div className="min-w-0 flex-1">
          {(eyebrow || title || description || actions) && (
            <div className="mb-8 flex flex-col gap-2">
              {eyebrow && (
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                  {eyebrow}
                </span>
              )}
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  {title && (
                    <h1 className="text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
                      {title}
                    </h1>
                  )}
                  {description && (
                    <p className="mt-1 max-w-md text-[15px] leading-[1.7] text-text-secondary">
                      {description}
                    </p>
                  )}
                </div>
                {actions && (
                  <div className="flex flex-wrap items-center gap-3">{actions}</div>
                )}
              </div>
            </div>
          )}
          {children}
        </div>
      </div>
    </main>
  );
}
