import { apiClient } from "@/lib/api";

async function withAuth(user) {
  if (!user) throw new Error("Not signed in");
  const token = await user.getIdToken();
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
}

export const teamService = {
  async saveTeam(user, team) {
    const opts = await withAuth(user);
    const payload = {
      name: (team.name || "").trim(),
      badge: (team.badge || "").trim(),
      shortName: (team.shortName || "").trim(),
      league: (team.league || "").trim(),
      country: (team.country || "").trim(),
      founded: team.founded ? Number(team.founded) : null,
      color: team.color || "#059669",
      members: team.members || [],
    };
    if (team.id) {
      const data = await apiClient(`/api/teams/${encodeURIComponent(team.id)}`, {
        method: "PUT",
        ...opts,
        body: JSON.stringify(payload),
      });
      return data.team.id;
    }
    const data = await apiClient("/api/teams", {
      method: "POST",
      ...opts,
      body: JSON.stringify(payload),
    });
    return data.team.id;
  },

  async getTeams(user) {
    if (!user) return [];
    const opts = await withAuth(user);
    const data = await apiClient("/api/teams", opts);
    return data.teams;
  },

  async getTeam(user, id) {
    if (!user) return null;
    const opts = await withAuth(user);
    const data = await apiClient(`/api/teams/${encodeURIComponent(id)}`, opts);
    return data.team;
  },

  async deleteTeam(user, id) {
    const opts = await withAuth(user);
    await apiClient(`/api/teams/${encodeURIComponent(id)}`, {
      method: "DELETE",
      ...opts,
    });
  },

  async addMember(user, id, uid) {
    const opts = await withAuth(user);
    const data = await apiClient(`/api/teams/${encodeURIComponent(id)}/members`, {
      method: "POST",
      ...opts,
      body: JSON.stringify({ uid }),
    });
    return data.team;
  },

  async removeMember(user, id, uid) {
    const opts = await withAuth(user);
    const data = await apiClient(
      `/api/teams/${encodeURIComponent(id)}/members/${encodeURIComponent(uid)}`,
      {
        method: "DELETE",
        ...opts,
      },
    );
    return data.team;
  },
};
