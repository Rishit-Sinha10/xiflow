"use client";

import { createContext, useContext, useCallback, useEffect, useState } from "react";
import { lineupService } from "@/lib/lineupService";
import { useAuth } from "@/context/auth_context";

const LineupContext = createContext(null);

export function LineupProvider({ children }) {
  const { user } = useAuth();
  const [lineups, setLineups] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLineups = useCallback(async () => {
    try {
      const list = user ? await lineupService.getLineups(user) : [];
      setLineups(list);
    } catch {
      // keep previous list on failure
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    lineupService
      .getLineups(user)
      .then((list) => setLineups(list))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const saveLineup = useCallback(
    async (data) => {
      if (!user) throw new Error("Not signed in");
      const id = await lineupService.saveLineup(user, data);
      await loadLineups();
      return id;
    },
    [user, loadLineups],
  );

  const deleteLineup = useCallback(
    async (id) => {
      if (!user) throw new Error("Not signed in");
      await lineupService.deleteLineup(user, id);
      setLineups((prev) => prev.filter((l) => l.id !== id));
    },
    [user],
  );

  const duplicateLineup = useCallback(
    async (id) => {
      if (!user) throw new Error("Not signed in");
      const copy = await lineupService.duplicateLineup(user, id);
      await loadLineups();
      return copy.id;
    },
    [user, loadLineups],
  );

  return (
    <LineupContext.Provider
      value={{
        lineups,
        loading,
        loadLineups,
        saveLineup,
        deleteLineup,
        duplicateLineup,
      }}
    >
      {children}
    </LineupContext.Provider>
  );
}

export function useLineup() {
  const ctx = useContext(LineupContext);
  if (!ctx) throw new Error("useLineup must be used within LineupProvider");
  return ctx;
}
