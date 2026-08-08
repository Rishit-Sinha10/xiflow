import { apiClient } from "@/lib/api";

export const playerService = {
  getPlayers: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, value);
      }
    });
    const qs = params.toString();
    return apiClient(`/api/players${qs ? `?${qs}` : ""}`);
  },

  search: (query) =>
    apiClient(`/api/players/search?q=${encodeURIComponent(query)}`),

  getPlayer: (id) => apiClient(`/api/players/${encodeURIComponent(id)}`),

  getPlayersByPosition: (position) =>
    apiClient(`/api/players/position/${encodeURIComponent(position)}`),
};
