"use client";

import { createContext, useContext, useCallback, useEffect, useState } from "react";
import { teamService } from "@/lib/teamService";
import { useAuth } from "@/context/auth_context";

const TeamContext = createContext(null);

export function TeamProvider({ children }) {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTeams = useCallback(async () => {
    try {
      const list = user ? await teamService.getTeams(user) : [];
      setTeams(list);
    } catch {
      // keep previous list on failure
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    teamService
      .getTeams(user)
      .then((list) => setTeams(list))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const saveTeam = useCallback(
    async (data) => {
      if (!user) throw new Error("Not signed in");
      const id = await teamService.saveTeam(user, data);
      await loadTeams();
      return id;
    },
    [user, loadTeams],
  );

  const deleteTeam = useCallback(
    async (id) => {
      if (!user) throw new Error("Not signed in");
      await teamService.deleteTeam(user, id);
      setTeams((prev) => prev.filter((t) => t.id !== id));
    },
    [user],
  );

  const addMember = useCallback(
    async (id, uid) => {
      if (!user) throw new Error("Not signed in");
      const team = await teamService.addMember(user, id, uid);
      setTeams((prev) => prev.map((t) => (t.id === id ? team : t)));
      return team;
    },
    [user],
  );

  const removeMember = useCallback(
    async (id, uid) => {
      if (!user) throw new Error("Not signed in");
      const team = await teamService.removeMember(user, id, uid);
      setTeams((prev) => prev.map((t) => (t.id === id ? team : t)));
      return team;
    },
    [user],
  );

  return (
    <TeamContext.Provider
      value={{
        teams,
        loading,
        loadTeams,
        saveTeam,
        deleteTeam,
        addMember,
        removeMember,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error("useTeam must be used within TeamProvider");
  return ctx;
}
