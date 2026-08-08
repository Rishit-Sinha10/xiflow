"use client";

import RequireAuth from "@/components/auth/RequireAuth";

export default function TeamsLayout({ children }) {
  return <RequireAuth>{children}</RequireAuth>;
}
