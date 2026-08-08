"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/shared/Loading";
import { useAuth } from "@/context/auth_context";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/?auth=signin");
  }, [loading, user, router]);

  if (loading) return <Loading full label="Checking session" />;
  if (!user) return null;
  return <>{children}</>;
}
