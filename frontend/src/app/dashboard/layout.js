"use client";

import RequireAuth from "@/components/auth/RequireAuth";

export default function DashboardLayout({ children }) {
  return <RequireAuth>{children}</RequireAuth>;
}
