"use client";

import RequireAuth from "@/components/auth/RequireAuth";

export default function BuilderLayout({ children }) {
  return <RequireAuth>{children}</RequireAuth>;
}
