import { apiClient } from "./api";

export const waitlistService = {
  join: (email, name) =>
    apiClient("/waitlist", {
      method: "POST",
      body: JSON.stringify({ email, name }),
    }),
};
