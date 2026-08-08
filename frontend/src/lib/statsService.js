import { apiClient } from "@/lib/api";

async function withAuth(user) {
  if (!user) throw new Error("Not signed in");
  const token = await user.getIdToken();
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
}

export const statsService = {
  async getOverview(user) {
    if (!user) return null;
    const opts = await withAuth(user);
    const data = await apiClient("/api/stats", opts);
    return data.stats;
  },
};
