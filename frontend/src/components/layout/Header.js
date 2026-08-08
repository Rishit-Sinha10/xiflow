"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Crosshair, LogOut, Sun, Moon } from "lucide-react";
import { useAuth } from "@/context/auth_context";
import { useTheme } from "@/context/theme_context";
export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  async function handleSignOut() {
    await logout();
    router.replace("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-overlay">
            <Crosshair className="h-4 w-4 text-foreground" strokeWidth={1.75} />
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">
            xiflow
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden max-w-[180px] truncate text-sm text-text-secondary sm:block">
            {user?.displayName || user?.email}
          </span>
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <Moon className="h-4 w-4" strokeWidth={1.75} />
            )}
          </button>
          <button
            onClick={handleSignOut}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-foreground"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </nav>
    </header>
  );
}
