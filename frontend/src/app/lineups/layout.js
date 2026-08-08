"use client";

import RequireAuth from "@/components/auth/RequireAuth";

export default function LineupsLayout({ children }) {
  return <RequireAuth>{children}</RequireAuth>;
}
