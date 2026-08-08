import { apiClient } from "@/lib/api";

async function withAuth(user) {
  if (!user) throw new Error("Not signed in");
  const token = await user.getIdToken();
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
}

export const lineupService = {
  async saveLineup(user, lineup) {
    const opts = await withAuth(user);
    const payload = {
      name: (lineup.name || "Untitled lineup").trim(),
      formation: lineup.formation,
      teamId: lineup.teamId || null,
      players: lineup.players,
    };
    if (lineup.id) {
      const data = await apiClient(`/api/lineups/${encodeURIComponent(lineup.id)}`, {
        method: "PUT",
        ...opts,
        body: JSON.stringify(payload),
      });
      return data.lineup.id;
    }
    const data = await apiClient("/api/lineups", {
      method: "POST",
      ...opts,
      body: JSON.stringify(payload),
    });
    return data.lineup.id;
  },

  async getLineups(user) {
    if (!user) return [];
    const opts = await withAuth(user);
    const data = await apiClient("/api/lineups", opts);
    return data.lineups;
  },

  async getLineup(user, id) {
    if (!user) return null;
    const opts = await withAuth(user);
    const data = await apiClient(`/api/lineups/${encodeURIComponent(id)}`, opts);
    return data.lineup;
  },

  async deleteLineup(user, id) {
    const opts = await withAuth(user);
    await apiClient(`/api/lineups/${encodeURIComponent(id)}`, {
      method: "DELETE",
      ...opts,
    });
  },

  async duplicateLineup(user, id) {
    const opts = await withAuth(user);
    const data = await apiClient(`/api/lineups/${encodeURIComponent(id)}/duplicate`, {
      method: "POST",
      ...opts,
    });
    return data.lineup;
  },

  async getStats(user, id) {
    if (!user) return null;
    const opts = await withAuth(user);
    const data = await apiClient(`/api/lineups/${encodeURIComponent(id)}/stats`, opts);
    return data.stats;
  },
};
