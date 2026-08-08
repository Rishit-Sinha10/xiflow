"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Crosshair, LayoutGrid, List, Users } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/builder", label: "Builder", icon: Crosshair },
  { href: "/lineups", label: "Lineups", icon: List },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/stats", label: "Stats", icon: BarChart3 },
];

function isActive(pathname, href) {
  if (href === "/dashboard") return pathname === href || pathname === "/";
  return pathname.startsWith(href);
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-[65px] z-30 border-b border-border bg-background/90 backdrop-blur-xl lg:hidden">
      <div className="flex gap-1 overflow-x-auto px-6 py-2">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                active ? "bg-overlay text-foreground" : "text-text-secondary"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-52 shrink-0 lg:block">
      <nav className="sticky top-24 flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-h-11 items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-overlay text-foreground"
                  : "text-text-secondary hover:bg-overlay hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
