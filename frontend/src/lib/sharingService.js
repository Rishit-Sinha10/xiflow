import { apiClient } from "@/lib/api";
async function withAuth(user) {
  if (!user) throw new Error("Not signed in");
  const token = await user.getIdToken();
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
}
export const sharingService = {
  async createShare(user, lineupId, options = {}) {
    const opts = await withAuth(user);
    const data = await apiClient(
      `/api/share/lineups/${encodeURIComponent(lineupId)}`,
      {
        method: "POST",
        ...opts,
        body: JSON.stringify(options),
      },
    );
    return data.share;
  },
  async getShared(accessCode) {
    const data = await apiClient(`/api/share/${encodeURIComponent(accessCode)}`);
    return data;
  },
  async deleteShare(user, shareId) {
    const opts = await withAuth(user);
    await apiClient(`/api/share/${encodeURIComponent(shareId)}`, {
      method: "DELETE",
      ...opts,
    });
  },
  async getShareStats(user, shareId) {
    const opts = await withAuth(user);
    const data = await apiClient(
      `/api/share/${encodeURIComponent(shareId)}/stats`,
      opts,
    );
    return data.share;
  },
};
